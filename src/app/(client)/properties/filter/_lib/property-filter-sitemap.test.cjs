const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const modulePath = join(__dirname, "property-filter-sitemap.ts");
let sitemapModule = {};

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
  sitemapModule = loadedModule.exports;
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const {
  SITEMAP_MAX_BYTES,
  buildPropertyFilterSitemapUrls,
  chunkSitemapUrls,
  countSitemapUrlChunks,
  createSitemapChunkManifest,
  getSitemapUrlChunk,
  getUtf8ByteLength,
  iteratePropertyFilterSitemapUrlRange,
  normalizeSitemapHostUrl,
  parseSitemapChunkSegment,
  serializeSitemapIndex,
  serializeSitemapUrlSet,
} = sitemapModule;

test("normalizeSitemapHostUrl removes trailing slashes from configured hosts", () => {
  assert.equal(
    normalizeSitemapHostUrl("https://primeproindonesia.com///"),
    "https://primeproindonesia.com",
  );
});

test("buildPropertyFilterSitemapUrls preserves one filter URL and ten page URLs per path", () => {
  const urls = buildPropertyFilterSitemapUrls(
    ["/dijual/rumah/dki-jakarta", "/disewa/apartemen/bali"],
    "https://primeproindonesia.com/properties",
    (segments) => `status=${segments[0]}&type=${segments[1]}`,
  );

  assert.equal(urls.length, 22);
  assert.equal(
    urls[0],
    "https://primeproindonesia.com/properties/filter/dijual/rumah/dki-jakarta",
  );
  assert.equal(
    urls[1],
    "https://primeproindonesia.com/properties?status=dijual&type=rumah&page=1",
  );
  assert.equal(
    urls[10],
    "https://primeproindonesia.com/properties?status=dijual&type=rumah&page=10",
  );
  assert.equal(
    urls[11],
    "https://primeproindonesia.com/properties/filter/disewa/apartemen/bali",
  );
});

test("serializeSitemapUrlSet escapes XML-sensitive URL characters exactly once", () => {
  const xml = serializeSitemapUrlSet([
    "https://example.com/properties?type=rumah&street=a<b>\"'",
  ]);

  assert.match(
    xml,
    /<loc>https:\/\/example\.com\/properties\?type=rumah&amp;street=a&lt;b&gt;&quot;&apos;<\/loc>/,
  );
  assert.doesNotMatch(xml, /&amp;amp;/);
});

test("getUtf8ByteLength measures encoded bytes rather than JavaScript characters", () => {
  assert.equal("é".length, 1);
  assert.equal(getUtf8ByteLength("é"), 2);
  assert.equal(getUtf8ByteLength("🏠"), 4);
});

test("chunkSitemapUrls creates deterministic chunks below the configured byte limit", () => {
  const urls = Array.from(
    { length: 8 },
    (_, index) => `https://example.com/properties/filter/rumah-${index}-é`,
  );
  const twoEntryLimit = getUtf8ByteLength(
    serializeSitemapUrlSet(urls.slice(0, 2)),
  );
  const chunks = chunkSitemapUrls(urls, twoEntryLimit);

  assert.deepEqual(
    chunks.map((chunk) => chunk.length),
    [2, 2, 2, 2],
  );
  assert.deepEqual(chunks.flat(), urls);
  for (const chunk of chunks) {
    assert.ok(
      getUtf8ByteLength(serializeSitemapUrlSet(chunk)) <= twoEntryLimit,
    );
  }
  assert.equal(SITEMAP_MAX_BYTES, 1_900_000);
});

test("large sitemap chunks remain within the 1.9 MB production limit", () => {
  const urls = Array.from(
    { length: 30_000 },
    (_, index) =>
      `https://example.com/properties/filter/rumah-${index}-${"é".repeat(20)}`,
  );
  const chunks = chunkSitemapUrls(urls);

  assert.ok(chunks.length > 1);
  assert.deepEqual(chunks.flat(), urls);
  for (const chunk of chunks) {
    assert.ok(
      getUtf8ByteLength(serializeSitemapUrlSet(chunk)) <= SITEMAP_MAX_BYTES,
    );
  }
});

test("serializeSitemapIndex creates a valid index and supports no child sitemaps", () => {
  const xml = serializeSitemapIndex([
    "https://example.com/properties/filter/sitemaps/0.xml",
    "https://example.com/properties/filter/sitemaps/1.xml",
  ]);

  assert.match(
    xml,
    /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/,
  );
  assert.match(
    xml,
    /<loc>https:\/\/example\.com\/properties\/filter\/sitemaps\/0\.xml<\/loc>/,
  );
  assert.match(
    serializeSitemapIndex([]),
    /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">\n<\/sitemapindex>/,
  );
  assert.deepEqual(chunkSitemapUrls([], SITEMAP_MAX_BYTES), []);
});

test("parseSitemapChunkSegment accepts non-negative XML chunk names only", () => {
  assert.equal(parseSitemapChunkSegment("0.xml"), 0);
  assert.equal(parseSitemapChunkSegment("12.xml"), 12);
  assert.equal(parseSitemapChunkSegment("01.xml"), null);
  assert.equal(parseSitemapChunkSegment("-1.xml"), null);
  assert.equal(parseSitemapChunkSegment("1"), null);
  assert.equal(parseSitemapChunkSegment("1.xml/extra"), null);
});

test("targeted sitemap chunk selection stops after the requested boundary", () => {
  const urls = Array.from(
    { length: 8 },
    (_, index) => `https://example.com/properties/filter/rumah-${index}-é`,
  );
  const twoEntryLimit = getUtf8ByteLength(
    serializeSitemapUrlSet(urls.slice(0, 2)),
  );
  let visited = 0;
  const trackedUrls = function* () {
    for (const url of urls) {
      visited += 1;
      yield url;
    }
  };

  assert.deepEqual(getSitemapUrlChunk(trackedUrls(), 0, twoEntryLimit), [
    urls[0],
    urls[1],
  ]);
  assert.equal(visited, 3);
  assert.equal(countSitemapUrlChunks(urls, twoEntryLimit), 4);
  assert.equal(getSitemapUrlChunk(urls, 4, twoEntryLimit), null);
});

test("a sitemap manifest provides deterministic ranges without rescanning earlier URLs", () => {
  const sitePaths = ["/one", "/two", "/three"];
  const allUrls = buildPropertyFilterSitemapUrls(
    sitePaths,
    "https://example.com/properties",
    (segments) => `path=${segments[0]}`,
  );
  const fiveEntryLimit = getUtf8ByteLength(
    serializeSitemapUrlSet(allUrls.slice(0, 5)),
  );
  const ranges = createSitemapChunkManifest(allUrls, fiveEntryLimit);
  const expectedRanges = [];
  let expectedStart = 0;
  for (const chunk of chunkSitemapUrls(allUrls, fiveEntryLimit)) {
    expectedRanges.push({
      start: expectedStart,
      end: expectedStart + chunk.length,
    });
    expectedStart += chunk.length;
  }

  assert.deepEqual(ranges, expectedRanges);
  assert.deepEqual(
    Array.from(
      iteratePropertyFilterSitemapUrlRange(
        sitePaths,
        "https://example.com/properties",
        (segments) => `path=${segments[0]}`,
        ranges[3].start,
        ranges[3].end,
      ),
    ),
    allUrls.slice(ranges[3].start, ranges[3].end),
  );
});
