import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const modulePath = join(import.meta.dirname, "generate-property-catalog.mjs");
const generatorModule = existsSync(modulePath)
  ? await import(pathToFileURL(modulePath).href)
  : {};

test("catalog generator fetches every API page and writes the Markdown snapshot", async () => {
  assert.equal(typeof generatorModule.generatePropertyCatalog, "function");

  const requestedUrls = [];
  const writes = [];
  const fetchImpl = async (url) => {
    requestedUrls.push(url);
    const page = Number(new URL(url).searchParams.get("page"));
    return {
      ok: true,
      json: async () => ({
        data: {
          data: [
            [
              {
                id: page,
                title: `Property ${page}`,
                description: "Description",
                updated_at: "2026-09-01T00:00:00.000Z",
                purchase_status: "ForSale",
                sold_status: "Available",
                building_type: "rumah",
                province: "dki-jakarta",
                regency: "jakarta-selatan",
                street: "kemang",
                price: 1000000000,
                currency: "Idr",
                measurements: {},
                specifications: {},
              },
              { fullname: "Ayu Properti" },
            ],
          ],
          pagination: { total_pages: 2 },
        },
      }),
    };
  };

  await generatorModule.generatePropertyCatalog({
    apiUrl: "https://api.example.com/",
    hostUrl: "https://primeproindonesia.com/",
    fetchImpl,
    writeFileImpl: async (...args) => writes.push(args),
    outputPath: "public/property-catalog.md",
    generatedAt: new Date("2026-09-01T00:00:00.000Z"),
  });

  assert.equal(requestedUrls.length, 2);
  assert.match(requestedUrls[0], /page=1&limit=100$/);
  assert.match(requestedUrls[1], /page=2&limit=100$/);
  assert.equal(writes.length, 1);
  assert.equal(writes[0][0], "public/property-catalog.md");
  assert.equal(writes[0][2], "utf8");
  assert.match(writes[0][1], /## Property 1:/);
  assert.match(writes[0][1], /## Property 2:/);
});

test("catalog generator rejects malformed API responses", async () => {
  assert.equal(typeof generatorModule.generatePropertyCatalog, "function");

  await assert.rejects(
    generatorModule.generatePropertyCatalog({
      apiUrl: "https://api.example.com",
      hostUrl: "https://primeproindonesia.com",
      fetchImpl: async () => ({ ok: true, json: async () => ({ data: null }) }),
      writeFileImpl: async () => {},
      outputPath: "public/property-catalog.md",
    }),
    /malformed/i,
  );
});
