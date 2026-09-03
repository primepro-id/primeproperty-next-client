const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "create-article-excerpt.ts");

function loadModule() {
  const source = readFileSync(modulePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };

  new Function("module", "exports", output)(loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

test("article excerpts contain text instead of executable or nested HTML", () => {
  const { createArticleExcerpt } = loadModule();
  const content = `
    <h1>Tips &amp; Trik</h1>
    <script>alert("unsafe")</script>
    <p>Aman&nbsp;untuk <strong>rumah</strong> &#47; apartemen.</p>
  `;

  assert.equal(
    createArticleExcerpt(content),
    "Tips & Trik Aman untuk rumah / apartemen.",
  );
});

test("article excerpts normalize malformed and empty CMS values", () => {
  const { createArticleExcerpt } = loadModule();

  assert.equal(
    createArticleExcerpt("<style>.hidden{}</style><p> Satu   dua"),
    "Satu dua",
  );
  assert.equal(
    createArticleExcerpt("Nilai &#99999999; tetap aman"),
    "Nilai &#99999999; tetap aman",
  );
  assert.equal(createArticleExcerpt(""), "");
});
