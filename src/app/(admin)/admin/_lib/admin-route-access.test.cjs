const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "admin-route-access.ts");
let getAdminRouteAccessState = () => undefined;

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
  getAdminRouteAccessState = loadedModule.exports.getAdminRouteAccessState;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("getAdminRouteAccessState waits for the access token query", () => {
  assert.equal(
    getAdminRouteAccessState(null, { isLoading: true, isError: false }),
    "loading",
  );
});

test("getAdminRouteAccessState distinguishes invalid sessions from denied roles", () => {
  assert.equal(
    getAdminRouteAccessState(null, { isLoading: false, isError: true }),
    "verification-error",
  );
  assert.equal(
    getAdminRouteAccessState(null, { isLoading: false, isError: false }),
    "verification-error",
  );
  assert.equal(
    getAdminRouteAccessState(
      { role: "Agent" },
      { isLoading: false, isError: false },
    ),
    "denied",
  );
  assert.equal(
    getAdminRouteAccessState(
      { role: "Unknown" },
      { isLoading: false, isError: false },
    ),
    "denied",
  );
});

test("getAdminRouteAccessState allows administrators", () => {
  assert.equal(
    getAdminRouteAccessState(
      { role: "Admin" },
      { isLoading: false, isError: false },
    ),
    "allowed",
  );
});
