import { Property } from "@/lib/types";
import { env } from "@/lib/env";

const slugify = (str: string) => str.toLowerCase().replaceAll(" ", "-");

export const createRelatedAreaSchema = (property: Property) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${env.NEXT_PUBLIC_HOST_URL}/properties/${property.id}#related`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: `${property.building_type} di ${property.province}`,
        item: `${env.NEXT_PUBLIC_HOST_URL}/properties/${slugify(property.province)}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${property.building_type} di ${property.regency}`,
        item: `${env.NEXT_PUBLIC_HOST_URL}/properties/${slugify(property.province)}/${slugify(property.regency)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${property.building_type} di ${property.street}`,
        item: `${env.NEXT_PUBLIC_HOST_URL}/properties/${slugify(property.province)}/${slugify(property.regency)}/${slugify(property.street)}`,
      },
    ],
  };
};
