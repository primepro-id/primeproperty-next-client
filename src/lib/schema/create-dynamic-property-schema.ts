import { env } from "@/lib/env";
import { createPropertyPath } from "@/lib/metadata/seo-domain";
import type { Property } from "@/lib/types";

export function createDynamicPropertySchema(property: Property) {
  const canonicalUrl = `${env.NEXT_PUBLIC_HOST_URL}${createPropertyPath(property)}`;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${canonicalUrl}#listing`,
    url: canonicalUrl,
    name: property.title,
    description: property.description_seo || property.description,
    image: property.images.map(
      (image) => `${env.NEXT_PUBLIC_S3_ENDPOINT}${image.path}`,
    ),
    about: { "@id": `${canonicalUrl}#place` },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: property.price,
      priceCurrency: property.currency === "Usd" ? "USD" : "IDR",
      url: canonicalUrl,
    },
  };
}
