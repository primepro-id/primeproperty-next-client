const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "reconcile-property-search-params.ts");
let reconcilePropertySearchParams = () => undefined;

try {
  const source = readFileSync(modulePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };

  new Function("module", "exports", output)(loadedModule, loadedModule.exports);
  reconcilePropertySearchParams =
    loadedModule.exports.reconcilePropertySearchParams;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("reconcilePropertySearchParams ignores an older navigation while a newer value is pending", () => {
  assert.deepEqual(
    reconcilePropertySearchParams(
      "province=bali",
      "province=bali&limit=25",
      true,
    ),
    { value: "province=bali&limit=25", pending: true },
  );
});

test("reconcilePropertySearchParams settles when the latest navigation commits", () => {
  assert.deepEqual(
    reconcilePropertySearchParams(
      "province=bali&limit=25",
      "province=bali&limit=25",
      true,
    ),
    { value: "province=bali&limit=25", pending: false },
  );
});

test("reconcilePropertySearchParams accepts browser navigation when nothing is pending", () => {
  assert.deepEqual(reconcilePropertySearchParams("page=2", "page=3", false), {
    value: "page=2",
    pending: false,
  });
});
