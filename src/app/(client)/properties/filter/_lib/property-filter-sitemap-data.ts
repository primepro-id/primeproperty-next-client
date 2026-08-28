import { findPropertySitePaths } from "@/lib/api";
import { env } from "@/lib/env";
import { unstable_cache } from "next/cache";
import qs from "qs";
import { parseFilterParams } from "../../_lib/parse-filter-params";
import {
  createSitemapChunkManifest,
  iteratePropertyFilterSitemapUrls,
  iteratePropertyFilterSitemapUrlRange,
  normalizeSitemapHostUrl,
} from "./property-filter-sitemap";

const propertiesBaseUrl = `${normalizeSitemapHostUrl(
  env.NEXT_PUBLIC_HOST_URL,
)}/properties`;

const serializeFilterQuery = (segments: string[]) =>
  qs.stringify(parseFilterParams(segments));

const getCachedPropertySitemapManifest = unstable_cache(
  async () => {
    const response = await findPropertySitePaths();
    if (!Array.isArray(response.data)) {
      throw new Error("Property sitemap paths are unavailable.");
    }

    const sitePaths = response.data;
    const propertyUrls = iteratePropertyFilterSitemapUrls(
      sitePaths,
      propertiesBaseUrl,
      serializeFilterQuery,
    );

    return {
      sitePaths,
      chunkRanges: createSitemapChunkManifest(propertyUrls),
    };
  },
  [
    "property-filter-sitemap-manifest",
    propertiesBaseUrl,
    env.NEXT_PUBLIC_API_URL,
  ],
  { revalidate: 60 * 60 * 24 },
);

export async function getPropertyFilterSitemapChunkCount() {
  const manifest = await getCachedPropertySitemapManifest();
  return manifest.chunkRanges.length;
}

export async function getPropertyFilterSitemapChunk(chunkIndex: number) {
  const manifest = await getCachedPropertySitemapManifest();
  const range = manifest.chunkRanges[chunkIndex];
  if (!range) {
    return null;
  }

  return Array.from(
    iteratePropertyFilterSitemapUrlRange(
      manifest.sitePaths,
      propertiesBaseUrl,
      serializeFilterQuery,
      range.start,
      range.end,
    ),
  );
}
