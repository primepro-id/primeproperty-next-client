const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "seo-domain.ts");
let seoModule = {};

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
  seoModule = loadedModule.exports;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const {
  createPropertyPath,
  createSeoMetadataFields,
  normalizeSeoText,
  resolveSeoRobotsPolicy,
} = seoModule;

test("property paths are stable canonical ID-title paths", () => {
  assert.equal(
    createPropertyPath({ id: 42, title: " Rumah & Villa / Kemang " }),
    "/properties/42-Rumah-Villa-Kemang",
  );
  assert.equal(
    createPropertyPath({ id: 43, title: "Rumah #5? 100% Strategis" }),
    "/properties/43-Rumah-%235%3F-100%25-Strategis",
  );
});

test("SEO text normalizes whitespace and truncates on a word boundary", () => {
  assert.equal(normalizeSeoText("  Rumah\n  nyaman   di Kemang ", 80), "Rumah nyaman di Kemang");
  assert.equal(normalizeSeoText("Rumah nyaman di Kemang Selatan", 20), "Rumah nyaman di");
});

test("robots policies distinguish indexable, query, invalid, utility, and private routes", () => {
  assert.deepEqual(resolveSeoRobotsPolicy({}), { index: true, follow: true });
  assert.deepEqual(resolveSeoRobotsPolicy({ isQueryVariant: true }), {
    index: false,
    follow: true,
  });
  assert.deepEqual(resolveSeoRobotsPolicy({ isValid: false }), {
    index: false,
    follow: true,
  });
  assert.deepEqual(resolveSeoRobotsPolicy({ isUtility: true }), {
    index: false,
    follow: true,
  });
  assert.deepEqual(resolveSeoRobotsPolicy({ isPrivate: true }), {
    index: false,
    follow: false,
  });
});

test("metadata fields are self-canonical with complete social and robots fields", () => {
  const metadata = createSeoMetadataFields({
    hostUrl: "https://primeproindonesia.com/",
    title: "Tentang PrimePro",
    description: "Tentang PrimePro Indonesia.",
    path: "/about",
    image: "https://cdn.example.com/about.jpg",
    index: true,
  });

  assert.equal(metadata.alternates.canonical, "https://primeproindonesia.com/about");
  assert.equal(metadata.openGraph.url, "https://primeproindonesia.com/about");
  assert.equal(metadata.openGraph.type, "website");
  assert.deepEqual(metadata.openGraph.images, ["https://cdn.example.com/about.jpg"]);
  assert.deepEqual(metadata.twitter.images, ["https://cdn.example.com/about.jpg"]);
  assert.deepEqual(metadata.robots, { index: true, follow: true });
  assert.equal(metadata.openGraph.siteName, "PrimePro Indonesia");
  assert.equal(metadata.openGraph.locale, "id_ID");
});
