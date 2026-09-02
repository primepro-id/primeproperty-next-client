import { env } from "@/lib/env";
import { createPropertyPath } from "@/lib/metadata/seo-domain";
import type { Property } from "@/lib/types";

function formatBreadcrumbName(segment: string) {
  return segment
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function createRelatedAreaSchema(property: Property) {
  const canonicalUrl = `${env.NEXT_PUBLIC_HOST_URL}${createPropertyPath(property)}`;
  const filterSegments = property.site_path
    .split("/")
    .filter(Boolean)
    .slice(0, 5);
  const filterItems = filterSegments.map((segment, index) => ({
    "@type": "ListItem",
    position: index + 3,
    name: formatBreadcrumbName(segment),
    item: `${env.NEXT_PUBLIC_HOST_URL}/properties/filter/${filterSegments
      .slice(0, index + 1)
      .join("/")}`,
  }));

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
