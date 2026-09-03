const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const sourceRoot = join(__dirname, "..", "..", "..");

function loadTsModule(findPropertyNavigation) {
  const source = readFileSync(
    join(sourceRoot, "app/(client)/_lib/get-public-property-navigation.ts"),
    "utf8",
  );
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (request) => {
    if (request === "@/lib/api") return { findPropertyNavigation };
    if (request === "@/lib/types" || request === "server-only") return {};
    if (request === "react") return require(request);
    throw new Error(`Unexpected test import: ${request}`);
  };

  new Function("module", "exports", "require", output)(
    loadedModule,
    loadedModule.exports,
    localRequire,
  );
  return loadedModule.exports;
}

test("optional public navigation resolves to an empty list after an API failure", async () => {
  const navigationModule = loadTsModule(async () => {
    throw new Error("navigation unavailable");
  });

  assert.deepEqual(await navigationModule.getPublicPropertyNavigation(), []);
});

test("optional public navigation exposes successful API data", async () => {
  const expectedNavigation = [{ building_type: "rumah" }];
  const navigationModule = loadTsModule(async () => ({
    data: expectedNavigation,
  }));

  assert.equal(
    await navigationModule.getPublicPropertyNavigation(),
    expectedNavigation,
  );
});
