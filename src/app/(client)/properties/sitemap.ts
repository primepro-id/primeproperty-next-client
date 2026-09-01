import { findPropertyJoinAgent } from "@/lib/api";
import { env } from "@/lib/env";
import { createPropertyPath } from "@/lib/metadata/seo-domain";
import type { PropertyJoinAgent } from "@/lib/types";
import type { MetadataRoute } from "next";

async function findAllPropertiesForSitemap() {
  const firstPage = await findPropertyJoinAgent({ page: 1, limit: 100 });
  if (!firstPage.data) {
    return [];
  }

  const remainingPages = await Promise.all(
    Array.from(
      { length: Math.max(0, firstPage.data.pagination.total_pages - 1) },
      (_, index) => findPropertyJoinAgent({ page: index + 2, limit: 100 }),
    ),
  );
  const properties = [
    ...firstPage.data.data,
    ...remainingPages.flatMap((page) => page.data?.data || []),
  ];
  const uniqueProperties = new Map<number, PropertyJoinAgent>();

  for (const propertyWithAgent of properties) {
    uniqueProperties.set(propertyWithAgent[0].id, propertyWithAgent);
  }

  return Array.from(uniqueProperties.values()).sort(
    (left, right) => left[0].id - right[0].id,
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await findAllPropertiesForSitemap();
  const propertyEntries: MetadataRoute.Sitemap = properties.map(
    ([property]) => ({
      url: `${env.NEXT_PUBLIC_HOST_URL}${createPropertyPath(property)}`,
      lastModified: new Date(property.updated_at),
    }),
  );

  return [
    {
      url: `${env.NEXT_PUBLIC_HOST_URL}/properties`,
    },
    ...propertyEntries,
  ];
}
