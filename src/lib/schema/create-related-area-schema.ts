import { env } from "@/lib/env";
import {
  createPropertyBreadcrumbSegments,
  createPropertyPath,
} from "@/lib/metadata/seo-domain";
import type { Property } from "@/lib/types";

export function createRelatedAreaSchema(property: Property) {
  const canonicalUrl = `${env.NEXT_PUBLIC_HOST_URL}${createPropertyPath(property)}`;
  const filterItems = createPropertyBreadcrumbSegments(property.site_path).map(
    (segment, index) => ({
      "@type": "ListItem",
      position: index + 3,
      name: segment.name,
      item: `${env.NEXT_PUBLIC_HOST_URL}${segment.path}`,
    }),
  );

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: env.NEXT_PUBLIC_HOST_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properti",
        item: `${env.NEXT_PUBLIC_HOST_URL}/properties`,
      },
      ...filterItems,
      {
        "@type": "ListItem",
        position: filterItems.length + 3,
        name: property.title,
        item: canonicalUrl,
      },
    ],
  };
}
