const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "run-agent-logout.ts");
let runAgentLogout = () => undefined;

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
  runAgentLogout = loadedModule.exports.runAgentLogout;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

test("runAgentLogout removes the remote session before deleting cookies", async () => {
  const events = [];

  await runAgentLogout({
    supertokensUserId: "supertokens-user-1",
    removeSession: async (userId) => events.push(`remove:${userId}`),
    deleteCookies: async () => events.push("delete-cookies"),
  });

  assert.deepEqual(events, ["remove:supertokens-user-1", "delete-cookies"]);
});

test("runAgentLogout deletes cookies when remote session removal fails", async () => {
  let cookiesDeleted = false;

  await assert.rejects(
    runAgentLogout({
      supertokensUserId: "supertokens-user-1",
      removeSession: async () => {
        throw new Error("remote unavailable");
      },
      deleteCookies: async () => {
        cookiesDeleted = true;
      },
    }),
    /remote unavailable/,
  );

  assert.equal(cookiesDeleted, true);
});

test("runAgentLogout skips remote removal without an id but still deletes cookies", async () => {
  let removeCalls = 0;
  let cookiesDeleted = false;

  await runAgentLogout({
    supertokensUserId: null,
    removeSession: async () => {
      removeCalls += 1;
    },
    deleteCookies: async () => {
      cookiesDeleted = true;
    },
  });

  assert.equal(removeCalls, 0);
  assert.equal(cookiesDeleted, true);
});
