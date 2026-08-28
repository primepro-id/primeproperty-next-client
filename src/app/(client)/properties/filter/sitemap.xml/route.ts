import { env } from "@/lib/env";
import { getPropertyFilterSitemapChunkCount } from "../_lib/property-filter-sitemap-data";
import {
  normalizeSitemapHostUrl,
  serializeSitemapIndex,
} from "../_lib/property-filter-sitemap";

const XML_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
  "Content-Type": "application/xml; charset=utf-8",
};

export async function GET() {
  try {
    const chunkCount = await getPropertyFilterSitemapChunkCount();
    const hostUrl = normalizeSitemapHostUrl(env.NEXT_PUBLIC_HOST_URL);
    const sitemapUrls = Array.from(
      { length: chunkCount },
      (_, index) => `${hostUrl}/properties/filter/sitemaps/${index}.xml`,
    );

    return new Response(serializeSitemapIndex(sitemapUrls), {
      headers: XML_CACHE_HEADERS,
    });
  } catch (error) {
    console.error(
      "Unable to generate the property filter sitemap index.",
      error,
    );
    return new Response("Property filter sitemap data is unavailable.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
