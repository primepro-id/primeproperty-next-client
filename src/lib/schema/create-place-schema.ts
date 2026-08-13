import { Property } from "@/lib/types";
import { env } from "@/lib/env";

export const createPlaceSchema = (property: Property) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
      addressLocality: `${property.street}, ${property.regency}`.replaceAll(
        "-",
        " ",
      ),
      addressRegion: property.province.replaceAll("-", " "),
      streetAddress: property.site_path
        .replaceAll("/", ", ")
        .replaceAll("-", " "),
    },
    url: `${env.NEXT_PUBLIC_HOST_URL}/properties/${property.id}`,
  };
  return jsonLd;
};
