const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const sourceRoot = join(__dirname, "..", "..", "..");

function loadTsModule(relativePath, stubs = {}) {
  const source = readFileSync(join(sourceRoot, relativePath), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
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

const seoDomain = loadTsModule("lib/metadata/seo-domain.ts");
const metadataStub = { createMetadata: (value) => value };

test("properties collection metadata uses a 150-160 character description", async () => {
  const metadataModule = loadTsModule(
    "app/(client)/properties/_lib/create-properties-metadata.ts",
    {
      "@/lib/metadata": metadataStub,
      "@/lib/metadata/seo-domain": seoDomain,
      "@/lib/types": {
        PropertyPurchaseStatus: { ForRent: "ForRent" },
      },
      "@/lib/to-title-case": { toTitleCase: (value) => value },
    },
  );

  const metadata = await metadataModule.generatePropertiesMetadata(
    Promise.resolve({}),
  );

  assert.ok(metadata.description.length >= 150);
  assert.ok(metadata.description.length <= 160);
});

test("valid and missing property detail metadata stay within 150-160 characters", async () => {
  let propertyResponse = {
    data: [
      {
        id: 42,
        title: "Rumah keluarga di Kemang",
        description: "Hunian modern dekat taman kota.",
        description_seo: null,
        images: [],
      },
    ],
  };
  const metadataModule = loadTsModule(
    "app/(client)/properties/[id]/_lib/generate-dynamic-property-metadata.ts",
    {
      "@/lib/api": {
        findUniquePropertyJoinAgent: async () => propertyResponse,
      },
      "@/lib/env": {
        env: { NEXT_PUBLIC_S3_ENDPOINT: "https://cdn.example.com/" },
      },
      "@/lib/metadata": metadataStub,
      "@/lib/metadata/seo-domain": seoDomain,
      "../../_lib/parse-property-route-ids": loadTsModule(
        "app/(client)/properties/_lib/parse-property-route-ids.ts",
      ),
    },
  );

  const validMetadata = await metadataModule.generateDynamicPropertyMetadata(
    Promise.resolve({ id: "42-rumah-keluarga" }),
  );
  propertyResponse = { data: null };
  const missingMetadata = await metadataModule.generateDynamicPropertyMetadata(
    Promise.resolve({ id: "404-rumah" }),
  );

  for (const metadata of [validMetadata, missingMetadata]) {
    assert.ok(metadata.description.length >= 150);
    assert.ok(metadata.description.length <= 160);
  }
});

test("malformed property detail metadata does not call the property API", async () => {
  let calls = 0;
  const metadataModule = loadTsModule(
    "app/(client)/properties/[id]/_lib/generate-dynamic-property-metadata.ts",
    {
      "@/lib/api": {
        findUniquePropertyJoinAgent: async () => {
          calls += 1;
          return { data: null };
        },
      },
      "@/lib/env": {
        env: { NEXT_PUBLIC_S3_ENDPOINT: "https://cdn.example.com/" },
      },
      "@/lib/metadata": metadataStub,
      "@/lib/metadata/seo-domain": seoDomain,
      "../../_lib/parse-property-route-ids": loadTsModule(
        "app/(client)/properties/_lib/parse-property-route-ids.ts",
      ),
    },
  );

  const metadata = await metadataModule.generateDynamicPropertyMetadata(
    Promise.resolve({ id: "not-a-property" }),
  );

  assert.equal(calls, 0);
  assert.equal(metadata.index, true);
  assert.ok(metadata.description.length >= 150);
  assert.ok(metadata.description.length <= 160);
});
