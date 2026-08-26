const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "get-properties-query-for-viewer.ts");
let getPropertiesQueryForViewer = () => undefined;

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
  getPropertiesQueryForViewer =
    loadedModule.exports.getPropertiesQueryForViewer;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("getPropertiesQueryForViewer preserves an admin property query", () => {
  assert.deepEqual(
    getPropertiesQueryForViewer(
      { id: "admin-1", role: "Admin" },
      { province: "bali", page: 2, limit: 25 },
    ),
    { province: "bali", page: 2, limit: 25 },
  );
});

test("getPropertiesQueryForViewer forces an agent to their own properties", () => {
  assert.deepEqual(
    getPropertiesQueryForViewer(
      { id: "agent-42", role: "Agent" },
      { agent_id: "injected-agent", sold_status: "Sold", page: 1, limit: 10 },
    ),
    {
      agent_id: "agent-42",
      sold_status: "Sold",
      page: 1,
      limit: 10,
    },
  );
});

test("getPropertiesQueryForViewer rejects missing and unknown viewers", () => {
  assert.equal(getPropertiesQueryForViewer(null, { page: 1, limit: 10 }), null);
  assert.equal(
    getPropertiesQueryForViewer(
      { id: "unknown-1", role: "Unknown" },
      { page: 1, limit: 10 },
    ),
    null,
  );
});
