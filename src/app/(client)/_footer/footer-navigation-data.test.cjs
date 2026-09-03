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

const navigation = [
  {
    purchase_status: "ForSale",
    building_type: "rumah",
    province: "DKI Jakarta",
    regency: "Jakarta Selatan",
    street: "Kebayoran Baru",
  },
  {
    purchase_status: "ForRent",
    building_type: "ruang usaha",
    province: "DKI Jakarta",
    regency: "Jakarta Selatan",
    street: "Kebayoran Baru",
  },
];

test("sale footer links contain clean filter paths", () => {
  const { createFooterNavigationGroups } = loadTsModule(
    "app/(client)/_footer/footer-navigation-data.ts",
    {
      "@/lib/utils": { toSlug: (value) => value.replaceAll(" ", "-") },
    },
  );

  const groups = createFooterNavigationGroups(navigation, "ForSale");

  assert.deepEqual(groups.buildingTypes, [
    { label: "rumah", href: "/properties/filter/dijual/rumah" },
  ]);
  assert.deepEqual(groups.homeRegencies, [
    {
      label: "Jakarta Selatan",
      href: "/properties/filter/dijual/rumah/DKI-Jakarta/Jakarta-Selatan",
    },
  ]);
});

test("rent footer building-type links contain no trailing parenthesis", () => {
  const { createFooterNavigationGroups } = loadTsModule(
    "app/(client)/_footer/footer-navigation-data.ts",
    {
      "@/lib/utils": { toSlug: (value) => value.replaceAll(" ", "-") },
    },
  );

  const groups = createFooterNavigationGroups(navigation, "ForRent");

  assert.deepEqual(groups.buildingTypes, [
    {
      label: "ruang usaha",
      href: "/properties/filter/disewa/ruang-usaha",
    },
  ]);
});
