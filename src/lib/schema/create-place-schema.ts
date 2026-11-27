import { env } from "@/lib/env";
import { createPropertyPath } from "@/lib/metadata/seo-domain";
import type { Property } from "@/lib/types";

function createAccommodationDetails(property: Property) {
  const buildingArea = property.measurements?.building_area ?? 0;
  const bedrooms = property.specifications?.bedrooms ?? 0;
  const bathrooms = property.specifications?.bathrooms ?? 0;

  return {
    ...(buildingArea > 0 && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: buildingArea,
        unitCode: "MTK",
      },
    }),
    ...(bedrooms > 0 && {
      numberOfRooms: bedrooms,
      numberOfBedrooms: bedrooms,
    }),
    ...(bathrooms > 0 && { numberOfBathroomsTotal: bathrooms }),
  };
}

export function createPlaceSchema(property: Property) {
  const canonicalUrl = `${env.NEXT_PUBLIC_HOST_URL}${createPropertyPath(property)}`;
  const accommodationDetails = createAccommodationDetails(property);
  const isAccommodation = Object.keys(accommodationDetails).length > 0;

  return {
    "@context": "https://schema.org",
    "@type": isAccommodation ? "Accommodation" : "Place",
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
    ...accommodationDetails,
    url: canonicalUrl,
  };
}
