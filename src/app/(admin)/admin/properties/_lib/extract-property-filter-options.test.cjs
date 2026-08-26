const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "extract-property-filter-options.ts");
let extractPropertyFilterOptions = () => undefined;

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
  extractPropertyFilterOptions =
    loadedModule.exports.extractPropertyFilterOptions;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("extractPropertyFilterOptions decodes, deduplicates, and sorts each path segment", () => {
  assert.deepEqual(
    extractPropertyFilterOptions([
      "/dijual/rumah-mewah/dki-jakarta/jakarta-selatan/pondok-indah",
      "/disewa/apartemen/bali/badung/seminyak",
      "/dijual/rumah-mewah/dki-jakarta/jakarta-selatan/kemang",
    ]),
    {
      buildingTypes: ["apartemen", "rumah mewah"],
      provinces: ["bali", "dki jakarta"],
      regencies: ["badung", "jakarta selatan"],
      streets: ["kemang", "pondok indah", "seminyak"],
    },
  );
});

test("extractPropertyFilterOptions keeps option lists independent and ignores missing segments", () => {
  assert.deepEqual(
    extractPropertyFilterOptions([
      "/dijual/ruko",
      "/disewa/vila/jawa-barat/bandung",
      "/dijual/vila/jawa-barat/bogor/puncak",
    ]),
    {
      buildingTypes: ["ruko", "vila"],
      provinces: ["jawa barat"],
      regencies: ["bandung", "bogor"],
      streets: ["puncak"],
    },
  );
});

test("extractPropertyFilterOptions returns empty lists when site paths are unavailable", () => {
  assert.deepEqual(extractPropertyFilterOptions(null), {
    buildingTypes: [],
    provinces: [],
    regencies: [],
    streets: [],
  });
});
