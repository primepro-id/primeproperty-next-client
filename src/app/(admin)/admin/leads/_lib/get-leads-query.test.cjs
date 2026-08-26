const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "get-leads-query.ts");
let getLeadsQueryForAgent = () => undefined;

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
  getLeadsQueryForAgent = loadedModule.exports.getLeadsQueryForAgent;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("getLeadsQueryForAgent leaves admin lead requests unfiltered", () => {
  assert.deepEqual(getLeadsQueryForAgent({ id: "admin-1", role: "Admin" }), {});
});

test("getLeadsQueryForAgent filters agent requests by the current agent id", () => {
  assert.deepEqual(getLeadsQueryForAgent({ id: "agent-42", role: "Agent" }), {
    agent_id: "agent-42",
  });
});

test("getLeadsQueryForAgent rejects a missing viewer identity", () => {
  assert.equal(getLeadsQueryForAgent(null), null);
});

test("getLeadsQueryForAgent rejects an unknown viewer role", () => {
  assert.equal(
    getLeadsQueryForAgent({ id: "unknown-1", role: "Unknown" }),
    null,
  );
});
