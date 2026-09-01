const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const projectRoot = join(__dirname, "..", "..", "..", "..", "..");

function loadMetadataModule() {
  const source = readFileSync(
    join(__dirname, "create-properties-metadata.ts"),
    "utf8",
  );
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (request) => {
    const stubs = {
      "@/lib/metadata": { createMetadata: (value) => value },
      "@/lib/metadata/seo-domain": {
        normalizeSeoText: (value) => value.replace(/\s+/g, " ").trim(),
      },
      "@/lib/types": {
        PropertyPurchaseStatus: {
          ForSale: "ForSale",
          ForRent: "ForRent",
          ForSaleOrRent: "ForSaleOrRent",
        },
      },
      "@/lib/to-title-case": {
        toTitleCase: (value) =>
          value.replace(/(^|[-\s])\S/g, (letter) => letter.toUpperCase()),
      },
    };
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

test("property introduction states inventory scope and freshness limits", () => {
  const { createPropertiesIntroduction } = loadMetadataModule();

  assert.equal(typeof createPropertiesIntroduction, "function");
  assert.equal(
    createPropertiesIntroduction(
      {
        building_type: "rumah",
        purchase_status: "ForSale",
        regency: "jakarta-selatan",
      },
      42,
    ),
    "PrimePro Indonesia menampilkan 42 rumah dijual di Jakarta Selatan. Setiap listing mencantumkan harga, lokasi, spesifikasi, tanggal pembaruan, dan agen yang dapat dihubungi. Ketersediaan dan harga dapat berubah, jadi verifikasi detail terbaru pada halaman properti atau langsung dengan agen listing.",
  );
});

test("homepage and listing sources keep sequential semantic headings", () => {
  const homepage = readFileSync(
    join(projectRoot, "src/app/(client)/page.tsx"),
    "utf8",
  );
  const faq = readFileSync(
    join(projectRoot, "src/app/(client)/properties/_components/faq/faq.tsx"),
    "utf8",
  );
  const title = readFileSync(
    join(projectRoot, "src/app/(client)/properties/_components/title.tsx"),
    "utf8",
  );

  assert.match(homepage, /PrimePro Indonesia adalah agen properti di Jakarta/);
  assert.match(homepage, /<h2[^>]*>PARTNERS<\/h2>/);
  assert.match(faq, /<h2[^>]*>\s*Our Company\s*<\/h2>/);
  assert.doesNotMatch(title, /<h1[\s\S]*?<p>/);
});
