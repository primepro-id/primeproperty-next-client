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
  createAgentPath,
  createAgentSeoDescription,
  createMissingPropertySeoDetails,
  createPropertyPath,
  createPropertySeoDescription,
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

test("agent paths produce URL-safe canonical fullname paths", () => {
  assert.equal(
    createAgentPath({ fullname: "  Sari & Partners / Jakarta  " }),
    "/agents/Sari-%26-Partners-%2F-Jakarta",
  );
});

test("property and agent descriptions preserve their subject within the meta description range", () => {
  const propertyDescription = createPropertySeoDescription({
    title: "Rumah keluarga di Kemang",
    description: "Hunian modern dekat taman kota.",
  });
  const agentDescription = createAgentSeoDescription({
    fullname: "Sari Wulandari",
    description: "Spesialis hunian keluarga di Jakarta Selatan.",
  });

  for (const description of [propertyDescription, agentDescription]) {
    assert.ok(description.length >= 150);
    assert.ok(description.length <= 160);
  }

  assert.match(propertyDescription, /Rumah keluarga di Kemang/);
  assert.match(agentDescription, /Sari Wulandari/);
});

test("descriptions use a natural completion sentence when truncation leaves them short", () => {
  const description = createPropertySeoDescription({
    title: "Rumah keluarga di Kemang",
    description: `${"x ".repeat(46)}supercalifragilisticexpialidocious`,
  });

  assert.ok(description.length >= 150);
  assert.ok(description.length <= 160);
  assert.match(
    description,
    /Temukan informasi lengkap dan layanan agen tepercaya dari PrimePro Indonesia\.$/,
  );
});

test("long property descriptions stop at a complete word within the meta description range", () => {
  const description = createPropertySeoDescription({
    title: "Rumah keluarga di Kemang",
    description:
      "Hunian modern dengan taman luas, pencahayaan alami, dan akses mudah ke sekolah serta pusat kuliner kawasan Kemang Selatan. Properti ini memiliki nilai investasi yang menjanjikan untuk keluarga modern.",
  });

  assert.equal(
    description,
    "Jelajahi Rumah keluarga di Kemang. Hunian modern dengan taman luas, pencahayaan alami, dan akses mudah ke sekolah serta pusat kuliner kawasan Kemang Selatan.",
  );
});

test("missing property metadata stays indexable with a complete description", () => {
  const missingPropertySeoDetails = createMissingPropertySeoDetails();

  assert.equal(missingPropertySeoDetails.index, true);
  assert.ok(missingPropertySeoDetails.description.length >= 150);
  assert.ok(missingPropertySeoDetails.description.length <= 160);
  assert.deepEqual(
    createSeoMetadataFields({
      hostUrl: "https://primeproindonesia.com",
      title: missingPropertySeoDetails.title,
      description: missingPropertySeoDetails.description,
      path: "/properties/999-not-found",
      image: "https://cdn.example.com/default.jpg",
      index: missingPropertySeoDetails.index,
    }).robots,
    { index: true, follow: true },
  );
});

test("SEO text normalizes whitespace and truncates on a word boundary", () => {
  assert.equal(
    normalizeSeoText("  Rumah\n  nyaman   di Kemang ", 80),
    "Rumah nyaman di Kemang",
  );
  assert.equal(
    normalizeSeoText("Rumah nyaman di Kemang Selatan", 20),
    "Rumah nyaman di",
  );
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

  assert.equal(
    metadata.alternates.canonical,
    "https://primeproindonesia.com/about",
  );
  assert.equal(metadata.openGraph.url, "https://primeproindonesia.com/about");
  assert.equal(metadata.openGraph.type, "website");
  assert.deepEqual(metadata.openGraph.images, [
    "https://cdn.example.com/about.jpg",
  ]);
  assert.deepEqual(metadata.twitter.images, [
    "https://cdn.example.com/about.jpg",
  ]);
  assert.deepEqual(metadata.robots, { index: true, follow: true });
  assert.equal(metadata.openGraph.siteName, "PrimePro Indonesia");
  assert.equal(metadata.openGraph.locale, "id_ID");
});
