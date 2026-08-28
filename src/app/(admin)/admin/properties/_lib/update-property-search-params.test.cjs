const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "update-property-search-params.ts");
let updatePropertySearchParams = () => undefined;

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
  updatePropertySearchParams = loadedModule.exports.updatePropertySearchParams;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("updatePropertySearchParams accumulates rapid filter changes from the latest optimistic value", () => {
  const firstUpdate = updatePropertySearchParams(
    "page=3&limit=25",
    { province: "bali" },
    true,
  );

  assert.equal(firstUpdate, "limit=25&province=bali");
  assert.equal(
    updatePropertySearchParams(firstUpdate, { building_type: "vila" }, true),
    "limit=25&province=bali&building_type=vila",
  );
});

test("updatePropertySearchParams removes cleared filters and resets the page", () => {
  assert.equal(
    updatePropertySearchParams(
      "province=bali&page=2&limit=10",
      { province: undefined },
      true,
    ),
    "limit=10",
  );
});

test("updatePropertySearchParams can change pages without resetting them", () => {
  assert.equal(
    updatePropertySearchParams("province=bali&page=2", { page: 3 }, false),
    "province=bali&page=3",
  );
});

test("updatePropertySearchParams enables the popular filter and resets the page", () => {
  assert.equal(
    updatePropertySearchParams(
      "province=bali&page=2&limit=25",
      { is_popular: "true" },
      true,
    ),
    "province=bali&limit=25&is_popular=true",
  );
});

test("updatePropertySearchParams removes the popular filter and resets the page", () => {
  assert.equal(
    updatePropertySearchParams(
      "province=bali&is_popular=true&page=2",
      { is_popular: undefined },
      true,
    ),
    "province=bali",
  );
});
