const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const sourceRoot = join(__dirname, "..", "..");

function loadTsxModule(relativePath, stubs) {
  const source = readFileSync(join(sourceRoot, relativePath), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (request) => {
    if (request === "react/jsx-runtime") return require(request);
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

test("public layout renders empty navigation chrome when its optional GET fails", async () => {
  const Header = () => null;
  const Footer = () => null;
  const layoutModule = loadTsxModule("app/(client)/layout.tsx", {
    "./_footer": { Footer },
    "./_header": { Header },
    "@/lib/metadata": { createMetadata: (value) => value },
    "@next/third-parties/google": { GoogleAnalytics: () => null },
    "@/lib/env": { env: { NEXT_PUBLIC_GA_ID: "GA-TEST" } },
    "./_lib/get-public-property-navigation": {
      getPublicPropertyNavigation: async () => [],
    },
  });

  const layout = await layoutModule.default({ children: "page content" });
  const [header, , footer] = layout.props.children;

  assert.equal(header.type, Header);
  assert.equal(footer.type, Footer);
  assert.deepEqual(header.props.navigations, []);
  assert.deepEqual(footer.props.navigations, []);
});
