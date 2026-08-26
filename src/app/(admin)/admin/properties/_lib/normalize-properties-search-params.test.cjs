const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "normalize-properties-search-params.ts");
let normalizePropertiesSearchParams = () => undefined;

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
  normalizePropertiesSearchParams =
    loadedModule.exports.normalizePropertiesSearchParams;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("normalizePropertiesSearchParams defaults pagination and ignores unsupported parameters", () => {
  assert.deepEqual(
    normalizePropertiesSearchParams({
      agent_id: "agent-from-url",
      unknown: "value",
    }),
    { page: 1, limit: 10 },
  );
});

test("normalizePropertiesSearchParams accepts supported filters and pagination", () => {
  assert.deepEqual(
    normalizePropertiesSearchParams({
      id: "42",
      province: " dki jakarta ",
      regency: "jakarta selatan",
      street: "kemang",
      building_type: "rumah",
      purchase_status: "ForRent",
      sold_status: "Available",
      page: "3",
      limit: "25",
    }),
    {
      id: 42,
      province: "dki jakarta",
      regency: "jakarta selatan",
      street: "kemang",
      building_type: "rumah",
      purchase_status: "ForRent",
      sold_status: "Available",
      page: 3,
      limit: 25,
    },
  );
});

test("normalizePropertiesSearchParams rejects invalid numbers, enums, arrays, and limits", () => {
  assert.deepEqual(
    normalizePropertiesSearchParams({
      id: "0",
      province: ["jakarta", "banten"],
      purchase_status: "Rent",
      sold_status: "Hidden",
      page: "-2",
      limit: "100",
    }),
    { page: 1, limit: 10 },
  );
});
