import {
  generateDescription,
  generateTitle,
} from "@/app/(client)/properties/_lib/create-properties-metadata";
import type { FindPropertyQuery } from "@/lib/api";
import { env } from "@/lib/env";
import { createPropertyPath } from "@/lib/metadata/seo-domain";
import type { PropertyJoinAgent } from "@/lib/types";

export function createPropertiesSchema(
  properties: PropertyJoinAgent[],
  searchParams: FindPropertyQuery,
  path = "/properties",
) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pageUrl = `${env.NEXT_PUBLIC_HOST_URL}${normalizedPath}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: generateTitle(searchParams),
        description: generateDescription(searchParams),
        mainEntity: { "@id": `${pageUrl}#items` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#items`,
        numberOfItems: properties.length,
        itemListElement: properties.map(([property], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: property.title,
          url: `${env.NEXT_PUBLIC_HOST_URL}${createPropertyPath(property)}`,
          image: property.images[0]
            ? `${env.NEXT_PUBLIC_S3_ENDPOINT}${property.images[0].path}`
            : undefined,
        })),
      },
    ],
  };
}
