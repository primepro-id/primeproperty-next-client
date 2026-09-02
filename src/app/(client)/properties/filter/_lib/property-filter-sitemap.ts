import type { PropertyNavigation } from "@/lib/types";

export const SITEMAP_MAX_BYTES = 1_900_000;

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>\n';
const URLSET_OPEN =
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
const URLSET_CLOSE = "</urlset>";
const SITEMAP_INDEX_OPEN =
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
const SITEMAP_INDEX_CLOSE = "</sitemapindex>";
const textEncoder = new TextEncoder();
const URLS_PER_FILTER_PATH = 1;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function serializeSitemapUrl(url: string) {
  return `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>\n`;
}

function getSitemapEnvelopeBytes() {
  return getUtf8ByteLength(`${XML_DECLARATION}${URLSET_OPEN}${URLSET_CLOSE}`);
}

function getSitemapEntryBytes(url: string, maxBytes: number) {
  const envelopeBytes = getSitemapEnvelopeBytes();
  const entryBytes = getUtf8ByteLength(serializeSitemapUrl(url));
  if (envelopeBytes + entryBytes > maxBytes) {
    throw new RangeError("A sitemap URL exceeds the configured byte limit.");
  }

  return entryBytes;
}

export function getUtf8ByteLength(value: string) {
  return textEncoder.encode(value).byteLength;
}

export function normalizeSitemapHostUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function parseSitemapChunkSegment(segment: string) {
  const match = /^(0|[1-9]\d*)\.xml$/.exec(segment);
  if (!match) {
    return null;
  }

  const chunkIndex = Number(match[1]);
  return Number.isSafeInteger(chunkIndex) ? chunkIndex : null;
}

export function buildPropertyFilterSitemapUrls(
  sitePaths: string[],
  propertiesBaseUrl: string,
) {
  return Array.from(
    iteratePropertyFilterSitemapUrls(sitePaths, propertiesBaseUrl),
  );
}

export function buildIndexablePropertyFilterPaths(
  navigations: PropertyNavigation[],
) {
  const uniquePaths = new Set<string>();

  for (const navigation of navigations) {
    const segments = navigation.site_path
      .split("/")
      .filter(Boolean)
      .slice(0, 5);
    for (
      let segmentCount = 1;
      segmentCount <= segments.length;
      segmentCount += 1
    ) {
      uniquePaths.add(`/${segments.slice(0, segmentCount).join("/")}`);
    }
  }

  return Array.from(uniquePaths);
}

export function* iteratePropertyFilterSitemapUrls(
  sitePaths: string[],
  propertiesBaseUrl: string,
) {
  yield* iteratePropertyFilterSitemapUrlRange(
    sitePaths,
    propertiesBaseUrl,
    0,
    sitePaths.length * URLS_PER_FILTER_PATH,
  );
}

export function* iteratePropertyFilterSitemapUrlRange(
  sitePaths: string[],
  propertiesBaseUrl: string,
  start: number,
  end: number,
) {
  const baseUrl = normalizeSitemapHostUrl(propertiesBaseUrl);
  const totalUrls = sitePaths.length * URLS_PER_FILTER_PATH;
  const rangeStart = Math.max(0, Math.trunc(start));
  const rangeEnd = Math.min(totalUrls, Math.max(rangeStart, Math.trunc(end)));

  for (let urlIndex = rangeStart; urlIndex < rangeEnd; ) {
    const sitePathIndex = Math.floor(urlIndex / URLS_PER_FILTER_PATH);
    const sitePath = sitePaths[sitePathIndex];
    const normalizedPath = sitePath.startsWith("/") ? sitePath : `/${sitePath}`;
    const pathEnd = Math.min(
      rangeEnd,
      (sitePathIndex + 1) * URLS_PER_FILTER_PATH,
    );

    for (; urlIndex < pathEnd; urlIndex += 1) {
      yield `${baseUrl}/filter${normalizedPath}`;
    }
  }
}

export function serializeSitemapUrlSet(urls: string[]) {
  const entries = urls.map(serializeSitemapUrl).join("");
  return `${XML_DECLARATION}${URLSET_OPEN}${entries}${URLSET_CLOSE}`;
}

export function chunkSitemapUrls(urls: string[], maxBytes = SITEMAP_MAX_BYTES) {
  const chunks: string[][] = [];
  const envelopeBytes = getSitemapEnvelopeBytes();
  let currentChunk: string[] = [];
  let currentBytes = envelopeBytes;

  for (const url of urls) {
    const entryBytes = getSitemapEntryBytes(url, maxBytes);

    if (currentChunk.length > 0 && currentBytes + entryBytes > maxBytes) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentBytes = envelopeBytes;
    }

    currentChunk.push(url);
    currentBytes += entryBytes;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export function countSitemapUrlChunks(
  urls: Iterable<string>,
  maxBytes = SITEMAP_MAX_BYTES,
) {
  return createSitemapChunkManifest(urls, maxBytes).length;
}

export type SitemapChunkRange = {
  start: number;
  end: number;
};

export function createSitemapChunkManifest(
  urls: Iterable<string>,
  maxBytes = SITEMAP_MAX_BYTES,
) {
  const ranges: SitemapChunkRange[] = [];
  const envelopeBytes = getSitemapEnvelopeBytes();
  let chunkStart = 0;
  let urlIndex = 0;
  let currentBytes = envelopeBytes;

  for (const url of urls) {
    const entryBytes = getSitemapEntryBytes(url, maxBytes);
    if (urlIndex > chunkStart && currentBytes + entryBytes > maxBytes) {
      ranges.push({ start: chunkStart, end: urlIndex });
      chunkStart = urlIndex;
      currentBytes = envelopeBytes;
    }

    currentBytes += entryBytes;
    urlIndex += 1;
  }

  if (urlIndex > chunkStart) {
    ranges.push({ start: chunkStart, end: urlIndex });
  }

  return ranges;
}

export function getSitemapUrlChunk(
  urls: Iterable<string>,
  targetChunkIndex: number,
  maxBytes = SITEMAP_MAX_BYTES,
) {
  if (!Number.isSafeInteger(targetChunkIndex) || targetChunkIndex < 0) {
    return null;
  }

  const envelopeBytes = getSitemapEnvelopeBytes();
  let currentChunkIndex = 0;
  let currentChunk: string[] = [];
  let currentBytes = envelopeBytes;

  for (const url of urls) {
    const entryBytes = getSitemapEntryBytes(url, maxBytes);
    if (currentChunk.length > 0 && currentBytes + entryBytes > maxBytes) {
      if (currentChunkIndex === targetChunkIndex) {
        return currentChunk;
      }

      currentChunkIndex += 1;
      currentChunk = [];
      currentBytes = envelopeBytes;
    }

    currentChunk.push(url);
    currentBytes += entryBytes;
  }

  return currentChunkIndex === targetChunkIndex && currentChunk.length > 0
    ? currentChunk
    : null;
}

export function serializeSitemapIndex(sitemapUrls: string[]) {
  const entries = sitemapUrls
    .map(
      (url) => `  <sitemap>\n    <loc>${escapeXml(url)}</loc>\n  </sitemap>\n`,
    )
    .join("");

  return `${XML_DECLARATION}${SITEMAP_INDEX_OPEN}${entries}${SITEMAP_INDEX_CLOSE}`;
}
