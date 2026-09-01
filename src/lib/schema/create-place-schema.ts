import { env } from "@/lib/env";
import { createPropertyPath } from "@/lib/metadata/seo-domain";
import type { Property } from "@/lib/types";

export function createPlaceSchema(property: Property) {
  const canonicalUrl = `${env.NEXT_PUBLIC_HOST_URL}${createPropertyPath(property)}`;

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${canonicalUrl}#place`,
    name: property.title,
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
      addressLocality: `${property.street}, ${property.regency}`.replaceAll(
        "-",
        " ",
      ),
      addressRegion: property.province.replaceAll("-", " "),
      streetAddress: property.street.replaceAll("-", " "),
    },
    url: canonicalUrl,
  };
}
