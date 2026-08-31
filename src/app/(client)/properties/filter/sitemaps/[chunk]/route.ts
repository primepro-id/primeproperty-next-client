import { getPropertyFilterSitemapChunk } from "../../_lib/property-filter-sitemap-data";
import {
  parseSitemapChunkSegment,
  serializeSitemapUrlSet,
} from "../../_lib/property-filter-sitemap";

const XML_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
  "Content-Type": "application/xml; charset=utf-8",
};

type PropertyFilterSitemapChunkRouteProps = {
  params: Promise<{ chunk: string }>;
};

export async function GET(
  _request: Request,
  { params }: PropertyFilterSitemapChunkRouteProps,
) {
  const { chunk } = await params;
  const chunkIndex = parseSitemapChunkSegment(chunk);
  if (chunkIndex === null) {
    return new Response("Sitemap chunk not found.", { status: 404 });
  }

  try {
    const sitemapUrls = await getPropertyFilterSitemapChunk(chunkIndex);
    if (!sitemapUrls) {
      return new Response("Sitemap chunk not found.", { status: 404 });
    }

    return new Response(serializeSitemapUrlSet(sitemapUrls), {
      headers: XML_CACHE_HEADERS,
    });
  } catch (error) {
    console.error(
      `Unable to generate property filter sitemap chunk ${chunkIndex}.`,
      error,
    );
    return new Response("Property filter sitemap data is unavailable.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
