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
        itemListElement: properties.map(([property], index) => {
          const canonicalUrl = `${env.NEXT_PUBLIC_HOST_URL}${createPropertyPath(property)}`;
          const coverImage =
            property.images.find((image) => image.is_cover) ??
            property.images[0];
          const image = coverImage
            ? `${env.NEXT_PUBLIC_S3_ENDPOINT}${coverImage.path}`
            : undefined;

          return {
            "@type": "ListItem",
            position: index + 1,
            name: property.title,
            url: canonicalUrl,
            image,
            item: {
              "@type": "RealEstateListing",
              "@id": `${canonicalUrl}#listing`,
              url: canonicalUrl,
              name: property.title,
              description: property.description_seo || property.description,
              image,
              dateModified: property.updated_at,
              address: {
                "@type": "PostalAddress",
                streetAddress: property.street,
                addressLocality: property.regency,
                addressRegion: property.province,
                addressCountry: "ID",
              },
              offers: {
                "@type": "Offer",
                price: property.price,
                priceCurrency:
                  property.currency === "Usd" ? "USD" : "IDR",
                availability:
                  property.sold_status === "Sold"
                    ? "https://schema.org/SoldOut"
                    : "https://schema.org/InStock",
                url: canonicalUrl,
              },
              additionalProperty: [
                {
                  "@type": "PropertyValue",
                  name: "Building type",
                  value: property.building_type,
                },
                property.measurements?.land_area
                  ? {
                      "@type": "PropertyValue",
                      name: "Land area",
                      value: property.measurements.land_area,
                      unitCode: "MTK",
                    }
                  : undefined,
                property.measurements?.building_area
                  ? {
                      "@type": "PropertyValue",
                      name: "Building area",
                      value: property.measurements.building_area,
                      unitCode: "MTK",
                    }
                  : undefined,
                property.specifications?.bedrooms
                  ? {
                      "@type": "PropertyValue",
                      name: "Bedrooms",
                      value: property.specifications.bedrooms,
                    }
                  : undefined,
                property.specifications?.bathrooms
                  ? {
                      "@type": "PropertyValue",
                      name: "Bathrooms",
                      value: property.specifications.bathrooms,
                    }
                  : undefined,
              ].filter(Boolean),
            },
          };
        }),
      },
    ],
  };
}
