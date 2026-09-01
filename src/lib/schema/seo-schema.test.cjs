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
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (request) => {
    if (Object.hasOwn(stubs, request)) {
      return stubs[request];
    }
    throw new Error(`Unexpected test import: ${request}`);
  };

  new Function("module", "exports", "require", output)(
    loadedModule,
    loadedModule.exports,
    localRequire,
  );
  return loadedModule.exports;
}

const envStub = {
  env: {
    NEXT_PUBLIC_HOST_URL: "https://primeproindonesia.com",
    NEXT_PUBLIC_S3_ENDPOINT: "https://cdn.example.com/",
  },
};
const seoDomain = loadTsModule("lib/metadata/seo-domain.ts");

const article = {
  slug: "panduan-rumah",
  title: "Panduan Membeli Rumah",
  _publishedAt: "2025-01-01T00:00:00.000Z",
  _updatedAt: "2025-01-02T00:00:00.000Z",
  thumbnail: { url: "https://cdn.example.com/article.jpg" },
  seo: { title: "Panduan Rumah", description: "Panduan memilih rumah." },
};

const property = {
  id: 42,
  title: "Rumah Kemang",
  description: "Rumah nyaman di Kemang.",
  description_seo: null,
  site_path: "/dijual/rumah/dki-jakarta/jakarta-selatan/kemang",
  purchase_status: "ForSale",
  building_type: "rumah",
  province: "dki-jakarta",
  regency: "jakarta-selatan",
  street: "kemang",
  price: 2500000000,
  currency: "Idr",
  images: [{ path: "property.jpg", is_cover: true }],
};

function assertSerializable(schema) {
  assert.equal(schema instanceof Promise, false);
  const serialized = JSON.stringify(schema);
  assert.notEqual(serialized, "{}");
  assert.doesNotMatch(serialized, /\[object Object\]/);
  return serialized;
}

test("article JSON-LD is synchronous and contains a real canonical breadcrumb", () => {
  const { generateBlogSchema } = loadTsModule(
    "app/(client)/blog/_lib/generate-blog-schema.ts",
    { "@/lib/env": envStub },
  );
  const schema = generateBlogSchema(article);
  const serialized = assertSerializable(schema);

  assert.deepEqual(
    schema["@graph"].map((item) => item["@type"]),
    ["Article", "BreadcrumbList"],
  );
  assert.match(
    serialized,
    /https:\/\/primeproindonesia\.com\/blog\/panduan-rumah/,
  );
  assert.deepEqual(
    schema["@graph"][1].itemListElement.map((item) => item.name),
    ["Home", "Blog", "Panduan Membeli Rumah"],
  );
});

test("primary listing JSON-LD contains only CollectionPage and ItemList types", () => {
  const { createPropertiesSchema } = loadTsModule(
    "lib/schema/create-properties-schema.ts",
    {
      "@/lib/env": envStub,
      "@/lib/metadata/seo-domain": seoDomain,
      "@/app/(client)/properties/_lib/create-properties-metadata": {
        generateTitle: () => "Rumah Dijual di Kemang | PrimePro Indonesia",
        generateDescription: () => "Temukan rumah dijual di Kemang.",
      },
    },
  );
  const schema = createPropertiesSchema(
    [[property, {}]],
    {},
    "/properties/filter/dijual/rumah/dki-jakarta",
  );
  assertSerializable(schema);

  assert.deepEqual(
    schema["@graph"].map((item) => item["@type"]),
    ["CollectionPage", "ItemList"],
  );
  assert.equal(
    schema["@graph"][1].itemListElement[0].url,
    "https://primeproindonesia.com/properties/42-Rumah-Kemang",
  );
  assert.equal(
    schema["@graph"][0].url,
    "https://primeproindonesia.com/properties/filter/dijual/rumah/dki-jakarta",
  );
});

test("property detail schemas use canonical URLs and real filter breadcrumbs", () => {
  const stubs = {
    "@/lib/env": envStub,
    "@/lib/metadata/seo-domain": seoDomain,
  };
  const detail = loadTsModule(
    "lib/schema/create-dynamic-property-schema.ts",
    stubs,
  ).createDynamicPropertySchema(property);
  const place = loadTsModule(
    "lib/schema/create-place-schema.ts",
    stubs,
  ).createPlaceSchema(property);
  const breadcrumb = loadTsModule(
    "lib/schema/create-related-area-schema.ts",
    stubs,
  ).createRelatedAreaSchema(property);

  assert.equal(detail["@type"], "RealEstateListing");
  assert.equal(detail.offers["@type"], "Offer");
  assert.equal(place["@type"], "Place");
  assert.equal(
    detail.url,
    "https://primeproindonesia.com/properties/42-Rumah-Kemang",
  );
  assert.equal(
    breadcrumb.itemListElement[2].item,
    "https://primeproindonesia.com/properties/filter/dijual",
  );
  assert.equal(
    breadcrumb.itemListElement.at(-1).item,
    "https://primeproindonesia.com/properties/42-Rumah-Kemang",
  );
  assertSerializable([detail, place, breadcrumb]);
});

test("organization and website schemas use complete identifiers and language fields", () => {
  const organization = loadTsModule(
    "lib/schema/create-organization-schema.ts",
    { "../env": envStub },
  ).createOrganizationSchema();
  const website = loadTsModule("lib/schema/create-website-schema.ts", {
    "../env": envStub,
  }).createWebsiteSchema();

  assert.equal(
    organization["@id"],
    "https://primeproindonesia.com/#organization",
  );
  assert.equal(organization.address.postalCode, "12120");
  assert.equal(Array.isArray(organization.sameAs), true);
  assert.equal(website.inLanguage, "id-ID");
  assert.equal(website["@id"], "https://primeproindonesia.com/#website");
  assertSerializable([organization, website]);
});

test("agent profiles expose a canonical ProfilePage and Person graph", () => {
  const { createAgentProfileSchema } = loadTsModule(
    "lib/schema/create-agent-profile-schema.ts",
    {
      "@/lib/env": envStub,
    },
  );
  const schema = createAgentProfileSchema({
    fullname: "Ayu Properti",
    description: "Agen PrimePro Indonesia.",
    email: "ayu@example.com",
    phone_number: "8123456789",
    instagram: "ayu.properti",
    profile_picture_url: "agents/ayu.jpg",
  });

  assert.deepEqual(
    schema["@graph"].map((item) => item["@type"]),
    ["ProfilePage", "Person"],
  );
  assert.equal(
    schema["@graph"][0].url,
    "https://primeproindonesia.com/agents/Ayu-Properti",
  );
  assert.equal(
    schema["@graph"][1].image,
    "https://cdn.example.com/agents/ayu.jpg",
  );
  assertSerializable(schema);
});
