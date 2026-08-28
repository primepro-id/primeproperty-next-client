const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "viewer-session.ts");
let extractVerifiedViewer = () => undefined;

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
  extractVerifiedViewer = loadedModule.exports.extractVerifiedViewer;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("extractVerifiedViewer returns trusted Admin and Agent identities", () => {
  assert.deepEqual(
    extractVerifiedViewer({ id: "admin-1", role: "Admin", email: "ignored" }),
    { id: "admin-1", role: "Admin" },
  );
  assert.deepEqual(extractVerifiedViewer({ id: "agent-1", role: "Agent" }), {
    id: "agent-1",
    role: "Agent",
  });
});

test("extractVerifiedViewer rejects malformed and unknown session claims", () => {
  assert.equal(extractVerifiedViewer(null), null);
  assert.equal(extractVerifiedViewer("Admin"), null);
  assert.equal(extractVerifiedViewer({ id: "", role: "Admin" }), null);
  assert.equal(extractVerifiedViewer({ id: "agent-1", role: "Unknown" }), null);
  assert.equal(extractVerifiedViewer({ role: "Admin" }), null);
});
