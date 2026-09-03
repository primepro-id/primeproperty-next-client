const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const sourceRoot = join(__dirname, "..", "..");

function loadTsModule(relativePath, stubs = {}) {
  const source = readFileSync(join(sourceRoot, relativePath), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (request) => {
    if (Object.hasOwn(stubs, request)) return stubs[request];
    throw new Error(`Unexpected test import: ${request}`);
  };

  new Function("module", "exports", "require", output)(
    loadedModule,
    loadedModule.exports,
    localRequire,
  );
  return loadedModule.exports;
}

test("public property GET requests opt out of persistent caching", async () => {
  const calls = [];
  const properties = loadTsModule("lib/api/properties.ts", {
    "../types": {},
    "./fetch-api": {
      fetchJsonApi: async (...args) => {
        calls.push(args);
        return { data: null };
      },
    },
    "./token": { getAccessToken: async () => "token" },
    qs: {
      __esModule: true,
      default: { stringify: () => "" },
    },
  });

  await properties.findUniquePropertyJoinAgent(7);
  await properties.findPropertyJoinAgent();
  await properties.findPropertyNavigation();

  assert.deepEqual(calls, [
    ["/properties/7/join-agents", { method: "GET", cache: "no-store" }],
    ["/properties/join-agents", { method: "GET", cache: "no-store" }],
    ["/properties/navigations", { method: "GET", cache: "no-store" }],
  ]);
});

test("public agent directory GET requests opt out of persistent caching", async () => {
  const calls = [];
  const agents = loadTsModule("lib/api/agents.ts", {
    "../types": {},
    "./fetch-api": {
      fetchJsonApi: async (...args) => {
        calls.push(args);
        return { data: null };
      },
    },
    "./token": { getAccessToken: async () => "token" },
  });

  await agents.getAgents();
  await agents.getAgentByFullname("Sari & Partners");

  assert.deepEqual(calls, [
    ["/agents", { method: "GET", cache: "no-store" }],
    [
      "/agents/fullname/Sari%20%26%20Partners",
      { method: "GET", cache: "no-store" },
    ],
  ]);
});
