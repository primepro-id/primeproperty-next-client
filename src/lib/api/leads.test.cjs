const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const source = readFileSync(join(__dirname, "leads.ts"), "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const requests = [];
const loadedModule = { exports: {} };

function loadDependency(id) {
  if (id === "./fetch-api") {
    return {
      fetchJsonApi: async (...args) => {
        requests.push(args);
        return { status: 200, data: null, message: "ok" };
      },
    };
  }

  if (id === "./token") {
    return { getAccessToken: async () => "access-token" };
  }

  if (id === "qs") {
    return require("qs");
  }

  throw new Error(`Unexpected dependency: ${id}`);
}

new Function("require", "module", "exports", output)(
  loadDependency,
  loadedModule,
  loadedModule.exports,
);

test("getLeads sends the current agent id as an authenticated query parameter", async () => {
  await loadedModule.exports.getLeads({ agent_id: "agent-42" });

  assert.deepEqual(requests, [
    [
      "/leads?agent_id=agent-42",
      {
        method: "GET",
        headers: { "x-access-token": "access-token" },
      },
    ],
  ]);
});
