const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");
const {
  unstable_doesMiddlewareMatch,
} = require("next/experimental/testing/server");

const { NextRequest } = require("next/server");
const source = readFileSync(join(__dirname, "proxy.ts"), "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
function loadProxy(api = {}) {
  const loadedModule = { exports: {} };
  const localRequire = (specifier) =>
    specifier === "./lib/api" ? api : require(specifier);
  new Function("require", "module", "exports", output)(
    localRequire,
    loadedModule,
    loadedModule.exports,
  );
  return loadedModule.exports;
}

const { config } = loadProxy();

test("admin proxy matches every nested admin route", () => {
  for (const url of [
    "https://primeproperty.test/admin",
    "https://primeproperty.test/admin/properties",
    "https://primeproperty.test/admin/properties/new",
    "https://primeproperty.test/admin/blog/images",
  ]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, url }), true, url);
  }
});

test("admin proxy ignores public routes", () => {
  for (const url of [
    "https://primeproperty.test/",
    "https://primeproperty.test/blog",
    "https://primeproperty.test/properties",
  ]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, url }), false, url);
  }
});

const adminUrl = "https://primeproperty.test/admin/properties";
const sessionRequest = () =>
  new NextRequest(adminUrl, {
    headers: { cookie: "accessToken=old-access; refreshToken=old-refresh" },
  });

test("proxy redirects missing access tokens without contacting the API", async () => {
  const { proxy } = loadProxy();
  const response = await proxy(new NextRequest(adminUrl));
  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get("location"),
    "https://primeproperty.test/auth",
  );
});

test("proxy preserves a verified session without refreshing cookies", async () => {
  const { proxy } = loadProxy({
    verifyAgentSession: async (token) => {
      assert.equal(token, "old-access");
      return { data: { status: "OK" } };
    },
  });
  const response = await proxy(sessionRequest());
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(response.headers.get("set-cookie"), null);
});

test("proxy rotates both cookies after refreshing an expired session", async () => {
  const { proxy } = loadProxy({
    verifyAgentSession: async () => ({ data: { status: "UNAUTHORISED" } }),
    refreshAgentSession: async (token) => {
      assert.equal(token, "old-refresh");
      return {
        data: {
          accessToken: { token: "new-access" },
          refreshToken: { token: "new-refresh" },
        },
      };
    },
  });
  const response = await proxy(sessionRequest());
  assert.equal(response.cookies.get("accessToken").value, "new-access");
  assert.equal(response.cookies.get("refreshToken").value, "new-refresh");
  assert.equal(response.cookies.get("accessToken").maxAge, 86400);
  assert.equal(response.cookies.get("refreshToken").maxAge, 86400);
});

test("proxy clears both cookies when refresh returns no session", async () => {
  const { proxy } = loadProxy({
    verifyAgentSession: async () => ({ data: { status: "UNAUTHORISED" } }),
    refreshAgentSession: async () => ({ data: null }),
  });
  const response = await proxy(sessionRequest());
  for (const name of ["accessToken", "refreshToken"]) {
    assert.equal(response.cookies.get(name).value, "");
    assert.equal(response.cookies.get(name).expires.getTime(), 0);
  }
  assert.equal(response.headers.get("x-middleware-next"), "1");
});

test("proxy preserves API-error handling for the downstream admin guard", async (t) => {
  const error = new Error("Session API unavailable");
  const log = t.mock.method(console, "error", () => {});
  const { proxy } = loadProxy({
    verifyAgentSession: async () => {
      throw error;
    },
  });
  const response = await proxy(sessionRequest());
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(log.mock.calls[0].arguments[1], error);
});
