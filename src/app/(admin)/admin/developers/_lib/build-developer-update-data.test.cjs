const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "build-developer-update-data.ts");
let buildDeveloperUpdateData = () => undefined;

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
  buildDeveloperUpdateData = loadedModule.exports.buildDeveloperUpdateData;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const formData = {
  logo_path: undefined,
  name: "Prime Developer",
  ignored: "must not reach the API",
};

test("buildDeveloperUpdateData retains the existing logo", () => {
  assert.deepEqual(
    buildDeveloperUpdateData(formData, "/developers/existing.webp"),
    {
      name: "Prime Developer",
      logo_path: "/developers/existing.webp",
    },
  );
});

test("buildDeveloperUpdateData prefers a newly uploaded logo", () => {
  assert.deepEqual(
    buildDeveloperUpdateData(
      formData,
      "/developers/existing.webp",
      "/developers/new.webp",
    ),
    {
      name: "Prime Developer",
      logo_path: "/developers/new.webp",
    },
  );
});
