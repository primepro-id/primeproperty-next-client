const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "parse-property-route-ids.ts");

function loadModule() {
  const source = readFileSync(modulePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };

  new Function("module", "exports", output)(loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

test("property detail route IDs accept positive integer prefixes only", () => {
  const { parsePropertyDetailId } = loadModule();

  assert.equal(parsePropertyDetailId("42-rumah-kemang"), 42);
  for (const value of ["", "abc-rumah", "0-rumah", "-1-rumah", "1.5-rumah"]) {
    assert.equal(parsePropertyDetailId(value), null);
  }
});

test("comparison IDs require exactly two positive integers", () => {
  const { parsePropertyComparisonIds } = loadModule();

  assert.deepEqual(parsePropertyComparisonIds("4,9"), [4, 9]);
  for (const value of [
    undefined,
    "",
    "4",
    "4,",
    ",9",
    "4,abc",
    "0,9",
    "4,-9",
    "4,9,12",
    ["4,9", "12,15"],
  ]) {
    assert.equal(parsePropertyComparisonIds(value), null);
  }
});
