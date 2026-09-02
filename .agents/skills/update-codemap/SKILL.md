---
name: update-codemap
description: Scan a repository, detect architecture drift, and update token-lean codemaps for AI context. Use when Codex needs to create or refresh docs/CODEMAPS or .reports/codemaps, summarize project structure, compare codemaps with code changes, or produce a deterministic codemap scan report.
---

# Update Codemaps

Refresh architecture codemaps from the actual repository state. Prefer facts from files and scripts over memory.

## Required Workflow

1. Run the scanner from the repository root:

```bash
python .agents/skills/update-codemap/scripts/scan_repo.py --root . --codemap-dir docs/CODEMAPS
```

If Python is unavailable, reproduce the scanner checks with `rg --files`, package manifests, route/schema searches, and git/file timestamps.

2. Read `.reports/codemap-scan.json` and `.reports/codemap-diff.txt`.
3. Update codemaps in `docs/CODEMAPS/` unless the repo already uses `.reports/codemaps/`.
4. If the report says `requires_approval: true`, show the diff summary and ask before overwriting existing codemaps.
5. Keep each codemap under roughly 1000 tokens and include only durable structure.

## Codemap Set

| File              | Include                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| `architecture.md` | Repo shape, workspace boundaries, entry points, runtime/data flow, build/test flow   |
| `backend.md`      | API routes, middleware, server actions, services/repos, DB/env access                |
| `frontend.md`     | Page tree, route tree, component hierarchy, providers, state/data-fetching, UI tests |
| `data.md`         | Stores, schema files, tables, migrations, seeds, policies, validation                |
| `dependencies.md` | Workspace package graph, runtime libraries, tools, external services                 |

Skip a file only when the repo type makes it truly irrelevant. Say why in `.reports/codemap-diff.txt`.

## Metadata

Start every codemap with:

```markdown
<!-- Generated: YYYY-MM-DD | Files scanned: N | Token estimate: ~N -->
```

Use the scanner's `generated_date`, `files_scanned`, and approximate token count for the final document. Count tokens roughly as `words * 1.35`; exactness is less important than spotting oversized maps.

## What To Scan

Use the scanner output first, then inspect relevant files directly.

- Project shape: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, lockfiles, app/package folders.
- Entry points: `src/app`, `src/pages`, `src/main.*`, `src/index.*`, `app.py`, `main.go`, `cmd/**`, package exports.
- Backend surface: `route.ts`, `middleware.ts`, `use server`, API/controllers/services/repos.
- Frontend surface: app/page routes, components, providers, hooks, state stores, tests.
- Data surface: `schema`, `migration`, `drizzle`, `prisma`, `supabase`, `pgTable`, SQL files.
- Dependencies: package manifests, workspace references, SDKs, external service clients.

## Diff And Approval Rules

The scanner compares current source fingerprints, codemap fingerprints, and the previous `.reports/codemap-scan.json`.

- `diff_percent <= 30`: update codemaps in place.
- `diff_percent > 30`: show `.reports/codemap-diff.txt` and ask before overwriting.
- Initial generation does not require approval.
- If the user explicitly asked to overwrite or regenerate, proceed and mention the large diff in the final response.

## Writing Rules

- Use terse file-path maps and arrows; avoid implementation walkthroughs.
- Prefer stable boundaries over temporary details.
- State absences explicitly when important: "No API routes detected", "Schema is empty", "No migrations tracked".
- Do not invent services, tables, routes, queues, auth, analytics, or deployment targets from dependencies alone.
- Treat generated/build folders and vendored dependencies as ignored context.
- Preserve user edits in codemaps unless the code proves they are stale.

## Report

Ensure `.reports/codemap-diff.txt` includes:

- Files scanned and codemap location.
- Files added/removed/modified since the last scan.
- New or removed dependencies.
- Architecture changes: routes, services, schema/migration changes, app/package boundaries.
- Staleness warnings for codemaps older than 90 days.
- Whether approval was required and why.
