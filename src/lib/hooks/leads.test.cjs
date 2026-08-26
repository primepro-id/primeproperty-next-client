const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const source = readFileSync(join(__dirname, "leads.ts"), "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const queries = [];
const loadedModule = { exports: {} };

function loadDependency(id) {
  if (id === "@tanstack/react-query") {
    return { queryOptions: (options) => options };
  }

  if (id === "../api") {
    return {
      createLead: async () => undefined,
      getLeads: async (query) => {
        queries.push(query);
        return query;
      },
    };
  }

  throw new Error(`Unexpected dependency: ${id}`);
}

new Function("require", "module", "exports", output)(
  loadDependency,
  loadedModule,
  loadedModule.exports,
);

test("getLeadsQueryOptions scopes its cache and request to the lead query", async () => {
  const query = { agent_id: "agent-42" };
  const options = loadedModule.exports.getLeadsQueryOptions(query);

  assert.deepEqual(options.queryKey, ["leads", "list", { query }]);
  await options.queryFn();
  assert.deepEqual(queries, [query]);
});
