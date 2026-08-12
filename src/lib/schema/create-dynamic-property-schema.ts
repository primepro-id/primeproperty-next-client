import { env } from "@/lib/env";
import { Property } from "../types";

export const createDynamicPropertySchema = (property: Property) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    brand: {
      "@type": "Brand",
      logo: [`${env.NEXT_PUBLIC_HOST_URL}/images/primepro.png`],
      name: "Primepro Indonesia",
      url: env.NEXT_PUBLIC_HOST_URL,
    },
    description: property.description,
    image: property.images.map(
      (image) => `${env.NEXT_PUBLIC_S3_ENDPOINT}${image.path}`,
    ),
    name: property.title,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: property.price,
      priceCurrency: "IDR",
      url: `${env.NEXT_PUBLIC_HOST_URL}/properties/${property.id}`,
    },
    url: `${env.NEXT_PUBLIC_HOST_URL}/properties/${property.id}`,
  };
  return jsonLd;
};
