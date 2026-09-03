const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "articles.ts");

test("article GET helpers are server-only cached functions, not Server Actions", () => {
  const source = readFileSync(modulePath, "utf8");
  assert.doesNotMatch(source, /^\s*["']use server["'];/m);

  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const cachedFunctions = [];
  const loadedModule = { exports: {} };
  const localRequire = (request) => {
    if (request === "server-only") return {};
    if (request === "react") {
      return {
        cache: (fn) => {
          cachedFunctions.push(fn);
          return fn;
        },
      };
    }
    if (request === "@apollo/client") {
      return {
        ApolloClient: class {},
        HttpLink: class {},
        InMemoryCache: class {},
      };
    }
    if (request === "../env") {
      return {
        env: {
          DATOCMS_API_TOKEN: "test-token",
          DATOCMS_API_URL: "https://cms.example.com",
        },
      };
    }
    if (request === "./gql") return {};
    throw new Error(`Unexpected test import: ${request}`);
  };

  new Function("module", "exports", "require", output)(
    loadedModule,
    loadedModule.exports,
    localRequire,
  );

  assert.equal(cachedFunctions.length, 2);
  assert.equal(loadedModule.exports.findArticleBySlug, cachedFunctions[0]);
  assert.equal(loadedModule.exports.findArticles, cachedFunctions[1]);
});
