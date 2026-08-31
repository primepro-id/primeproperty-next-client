import { findPropertyJoinAgent } from "@/lib/api";
import { env } from "@/lib/env";
import { MetadataRoute } from "next";

const generateDynamicPropertySitemaps = async () => {
  const properties = await findPropertyJoinAgent();
  if (Array.isArray(properties?.data?.data)) {
    const oldSitemap = properties.data?.data.map((property) => {
      return {
        url: env.NEXT_PUBLIC_HOST_URL + `/properties/${property[0].id}`,
        lastModified: new Date(property[0].updated_at),
      };
    }) as MetadataRoute.Sitemap;
    const newSitemap = properties.data?.data.map((property) => {
      return {
        url:
          env.NEXT_PUBLIC_HOST_URL +
          `/properties/${property[0].id}-${property[0].title.replaceAll("&", "").replaceAll(" ", "-").replaceAll("/", "")}`,
        lastModified: new Date(property[0].updated_at),
      };
    }) as MetadataRoute.Sitemap;
    return [...oldSitemap, ...newSitemap];
  }

  return [];
};

async function generatePropertyPagesSitemaps() {
  // Google's limit is 50,000 URLs per sitemap

  const basePropertySitemap = await findPropertyJoinAgent({
    page: 1,
    limit: 30,
  });

  const sitemaps = [];

  if (Array.isArray(basePropertySitemap?.data?.data)) {
    for (let i = 0; i < basePropertySitemap.data.pagination.total_pages; i++) {
      sitemaps.push({
        url: env.NEXT_PUBLIC_HOST_URL + `/properties?page=${i + 1}`,
        date: new Date(),
      });
    }
  }

  if (sitemaps.length > 0) {
    return sitemaps;
  }

  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const propertyPagesSitemaps = await generatePropertyPagesSitemaps();
  const dynamicPropertySitemaps = await generateDynamicPropertySitemaps();

  return [
    {
      url: env.NEXT_PUBLIC_HOST_URL + `/properties`,
      lastModified: new Date(),
    },
    ...propertyPagesSitemaps,
    ...dynamicPropertySitemaps,
  ];
}
