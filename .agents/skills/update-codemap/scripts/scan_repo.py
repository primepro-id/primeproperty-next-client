#!/usr/bin/env python3
"""Deterministic repository scanner for the update-codemap skill."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

IGNORED_DIRS = {
    ".agents",
    ".codex",
    ".git",
    ".next",
    ".reports",
    ".turbo",
    ".vercel",
    ".vscode",
    "CODEMAPS",
    "coverage",
    "dist",
    "build",
    "logs",
    "node_modules",
}

SOURCE_SUFFIXES = {
    ".cjs",
    ".css",
    ".go",
    ".js",
    ".jsx",
    ".json",
    ".md",
    ".mjs",
    ".py",
    ".sql",
    ".toml",
    ".ts",
    ".tsx",
    ".yaml",
    ".yml",
}

CODEMAP_FILES = [
    "architecture.md",
    "backend.md",
    "frontend.md",
    "data.md",
    "dependencies.md",
]


@dataclass(frozen=True)
class FileFingerprint:
    path: str
    sha256: str
    size: int


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scan repo facts for codemap updates.")
    parser.add_argument("--root", default=".", help="Repository root.")
    parser.add_argument(
        "--codemap-dir",
        default="docs/CODEMAPS",
        help="Codemap directory relative to root.",
    )
    parser.add_argument(
        "--report-dir",
        default=".reports",
        help="Report directory relative to root.",
    )
    return parser.parse_args()


def is_ignored(path: Path) -> bool:
    return any(part in IGNORED_DIRS for part in path.parts)


def relative_path(root: Path, path: Path) -> str:
    return path.relative_to(root).as_posix()


def iter_source_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for current_root, dirnames, filenames in os.walk(root):
        dirnames[:] = [dirname for dirname in dirnames if dirname not in IGNORED_DIRS]
        current_path = Path(current_root)
        for filename in filenames:
            path = current_path / filename
            relative = path.relative_to(root)
            if is_ignored(relative):
                continue
            if path.suffix.lower() in SOURCE_SUFFIXES or path.name in {
                "AGENTS.md",
                "Dockerfile",
                "Makefile",
            }:
                files.append(path)
    return sorted(files)


def fingerprint_file(root: Path, path: Path) -> FileFingerprint:
    content = path.read_bytes()
    return FileFingerprint(
        path=relative_path(root, path),
        sha256=hashlib.sha256(content).hexdigest(),
        size=len(content),
    )


def read_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def load_package(path: Path) -> dict[str, Any]:
    data = read_json(path)
    if isinstance(data, dict):
        return data
    return {}


def find_files(root: Path, names: set[str] | None = None, suffixes: set[str] | None = None) -> list[str]:
    matches: list[str] = []
    for path in iter_source_files(root):
        if names and path.name in names:
            matches.append(relative_path(root, path))
            continue
        if suffixes and path.suffix.lower() in suffixes:
            matches.append(relative_path(root, path))
    return sorted(matches)


def find_text_matches(root: Path, needles: tuple[str, ...]) -> list[str]:
    matches: list[str] = []
    for path in iter_source_files(root):
        if path.suffix.lower() not in {".js", ".jsx", ".ts", ".tsx", ".sql", ".py", ".go"}:
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        if any(needle in text for needle in needles):
            matches.append(relative_path(root, path))
    return sorted(matches)


def collect_packages(root: Path) -> dict[str, dict[str, Any]]:
    package_files = find_files(root, names={"package.json"})
    packages: dict[str, dict[str, Any]] = {}
    for package_file in package_files:
        path = root / package_file
        package_json = load_package(path)
        name = package_json.get("name") or Path(package_file).parent.as_posix()
        dependencies = sorted(
            {
                *package_json.get("dependencies", {}).keys(),
                *package_json.get("devDependencies", {}).keys(),
                *package_json.get("peerDependencies", {}).keys(),
            }
        )
        packages[str(name)] = {
            "path": package_file,
            "dependencies": dependencies,
            "workspace_dependencies": [
                dep for dep in dependencies if dep.startswith("@") and "kivo-play" in dep
            ],
            "scripts": sorted(package_json.get("scripts", {}).keys()),
        }
    return dict(sorted(packages.items()))


def detect_project_shape(root: Path, packages: dict[str, dict[str, Any]]) -> str:
    if (root / "pnpm-workspace.yaml").exists() or (root / "turbo.json").exists():
        return "monorepo"
    if len(packages) > 1:
        return "multi-package"
    if (root / "package.json").exists():
        return "single-js-app"
    if (root / "pyproject.toml").exists():
        return "python-project"
    if (root / "go.mod").exists():
        return "go-project"
    return "unknown"


def codemap_status(root: Path, codemap_dir: Path) -> dict[str, Any]:
    status: dict[str, Any] = {}
    now = datetime.now(timezone.utc)
    for name in CODEMAP_FILES:
        path = codemap_dir / name
        if not path.exists():
            status[name] = {"exists": False}
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        modified = datetime.fromtimestamp(path.stat().st_mtime, timezone.utc)
        age_days = (now - modified).days
        status[name] = {
            "exists": True,
            "path": relative_path(root, path),
            "sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(),
            "size": len(text.encode("utf-8")),
            "age_days": age_days,
            "stale": age_days > 90,
            "token_estimate": round(len(text.split()) * 1.35),
        }
    return status


def diff_summary(
    current: dict[str, FileFingerprint], previous: dict[str, Any]
) -> dict[str, Any]:
    previous_files = previous.get("source_fingerprints", {})
    if not isinstance(previous_files, dict) or not previous_files:
        return {
            "initial": True,
            "added": sorted(current),
            "removed": [],
            "modified": [],
            "diff_percent": 0,
            "requires_approval": False,
        }

    previous_paths = set(previous_files)
    current_paths = set(current)
    added = sorted(current_paths - previous_paths)
    removed = sorted(previous_paths - current_paths)
    modified = sorted(
        path
        for path in current_paths & previous_paths
        if previous_files[path].get("sha256") != current[path].sha256
    )
    changed_count = len(added) + len(removed) + len(modified)
    baseline_count = max(len(previous_paths), 1)
    diff_percent = round((changed_count / baseline_count) * 100, 2)
    return {
        "initial": False,
        "added": added,
        "removed": removed,
        "modified": modified,
        "diff_percent": diff_percent,
        "requires_approval": diff_percent > 30,
    }


def dependency_delta(
    packages: dict[str, dict[str, Any]], previous: dict[str, Any]
) -> dict[str, list[str]]:
    current_deps = {
        dep
        for package in packages.values()
        for dep in package.get("dependencies", [])
        if isinstance(dep, str)
    }
    previous_packages = previous.get("packages", {})
    previous_deps = {
        dep
        for package in previous_packages.values()
        for dep in package.get("dependencies", [])
        if isinstance(dep, str)
    }
    return {
        "added": sorted(current_deps - previous_deps),
        "removed": sorted(previous_deps - current_deps),
    }


def write_text_report(path: Path, scan: dict[str, Any]) -> None:
    diff = scan["diff"]
    stale = [
        name
        for name, item in scan["codemaps"].items()
        if item.get("exists") and item.get("stale")
    ]
    lines = [
        f"Generated: {scan['generated_date']}",
        f"Files scanned: {scan['files_scanned']}",
        f"Codemap location: {scan['codemap_dir']}",
        "",
        "Diff status:",
        f"- Initial generation: {diff['initial']}",
        f"- Diff percentage: {diff['diff_percent']}%",
        f"- Requires approval: {diff['requires_approval']}",
        "",
        "Files added:",
        *[f"- {item}" for item in diff["added"][:80]],
        "",
        "Files removed:",
        *[f"- {item}" for item in diff["removed"][:80]],
        "",
        "Files modified:",
        *[f"- {item}" for item in diff["modified"][:80]],
        "",
        "Dependency changes:",
        *[f"- Added: {item}" for item in scan["dependency_delta"]["added"]],
        *[f"- Removed: {item}" for item in scan["dependency_delta"]["removed"]],
        "",
        "Architecture signals:",
        f"- Project shape: {scan['project_shape']}",
        f"- Route files: {len(scan['signals']['route_files'])}",
        f"- Middleware files: {len(scan['signals']['middleware_files'])}",
        f"- Server action files: {len(scan['signals']['server_action_files'])}",
        f"- Schema/data files: {len(scan['signals']['data_files'])}",
        "",
        "Staleness warnings:",
        *([f"- {item} is older than 90 days" for item in stale] or ["- None"]),
    ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    args = parse_args()
    root = Path(args.root).resolve()
    codemap_dir = (root / args.codemap_dir).resolve()
    report_dir = (root / args.report_dir).resolve()
    report_dir.mkdir(parents=True, exist_ok=True)

    scan_path = report_dir / "codemap-scan.json"
    previous = read_json(scan_path)
    files = iter_source_files(root)
    fingerprints = {relative_path(root, path): fingerprint_file(root, path) for path in files}
    packages = collect_packages(root)

    scan: dict[str, Any] = {
        "generated_date": date.today().isoformat(),
        "root": root.as_posix(),
        "codemap_dir": relative_path(root, codemap_dir),
        "files_scanned": len(files),
        "project_shape": detect_project_shape(root, packages),
        "packages": packages,
        "signals": {
            "entry_points": find_files(
                root,
                names={"index.ts", "index.tsx", "main.ts", "main.tsx", "app.py", "main.go"},
            ),
            "route_files": find_files(root, names={"route.ts", "route.tsx", "route.js"}),
            "middleware_files": find_files(root, names={"middleware.ts", "middleware.js"}),
            "server_action_files": find_text_matches(root, ("use server",)),
            "component_files": find_files(root, suffixes={".tsx", ".jsx"}),
            "data_files": sorted(
                {
                    *find_text_matches(root, ("pgTable", "drizzle", "prisma", "createClient")),
                    *find_files(root, suffixes={".sql"}),
                }
            ),
            "test_files": [
                path
                for path in find_files(root, suffixes={".ts", ".tsx", ".js", ".jsx", ".sql"})
                if ".test." in path or ".spec." in path or "/tests/" in path
            ],
        },
        "codemaps": codemap_status(root, codemap_dir),
        "source_fingerprints": {
            path: {
                "sha256": item.sha256,
                "size": item.size,
            }
            for path, item in fingerprints.items()
        },
    }
    scan["diff"] = diff_summary(fingerprints, previous)
    scan["dependency_delta"] = dependency_delta(packages, previous)

    scan_path.write_text(json.dumps(scan, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    write_text_report(report_dir / "codemap-diff.txt", scan)
    print(json.dumps({"scan": scan_path.as_posix(), "report": (report_dir / "codemap-diff.txt").as_posix(), "requires_approval": scan["diff"]["requires_approval"]}, indent=2))


if __name__ == "__main__":
    main()
