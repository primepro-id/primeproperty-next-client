import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const modulePath = join(import.meta.dirname, "property-catalog-domain.mjs");
const catalogModule = existsSync(modulePath)
  ? await import(pathToFileURL(modulePath).href)
  : {};

const property = {
  id: 42,
  title: " Rumah & Villa / Kemang ",
  description: `  ${"x".repeat(260)}\n second line  `,
  updated_at: "2026-09-01T00:00:00.000Z",
  purchase_status: "ForSale",
  sold_status: "Available",
  building_type: "rumah",
  province: "dki-jakarta",
  regency: "jakarta-selatan",
  street: "kemang",
  price: 2500000000,
  currency: "Idr",
  measurements: { land_area: 200, building_area: 150 },
  specifications: { bedrooms: 3, bathrooms: 2, carport: 1, garage: 0 },
};

const agent = { fullname: "Ayu Properti" };

test("catalog properties are unique by id and sorted ascending", () => {
  assert.equal(typeof catalogModule.normalizeCatalogProperties, "function");

  const normalized = catalogModule.normalizeCatalogProperties([
    [{ ...property, id: 99 }, agent],
    [property, agent],
    [{ ...property, title: "Latest duplicate" }, agent],
  ]);

  assert.deepEqual(
    normalized.map(([item]) => item.id),
    [42, 99],
  );
  assert.equal(normalized[0][0].title, "Latest duplicate");
});

test("catalog markdown is canonical, factual, and freshness-qualified", () => {
  assert.equal(typeof catalogModule.renderPropertyCatalog, "function");

  const markdown = catalogModule.renderPropertyCatalog([[property, agent]], {
    hostUrl: "https://primeproindonesia.com/",
    generatedAt: new Date("2026-09-01T00:00:00.000Z"),
  });

  assert.match(markdown, /^# PrimePro Indonesia Property Catalog/m);
  assert.match(markdown, /Generated at: 2026-09-01T00:00:00.000Z/);
  assert.match(markdown, /Prices and availability are time-sensitive/);
  assert.match(
    markdown,
    /https:\/\/primeproindonesia\.com\/properties\/42-Rumah-Villa-Kemang/,
  );
  assert.equal((markdown.match(/## Property 42:/g) || []).length, 1);
  assert.match(markdown, /- Price: IDR 2,500,000,000/);
  assert.match(markdown, /- Agent: Ayu Properti/);

  const description = markdown.match(/- Description: (.*)/)?.[1] ?? "";
  assert.equal(description.length, 240);
  assert.doesNotMatch(description, /\s{2,}/);
});
