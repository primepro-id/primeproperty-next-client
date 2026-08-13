import {
  generateDescription,
  generateTitle,
} from "@/app/(client)/properties/_lib/create-properties-metadata";
import { FindPropertyQuery } from "@/lib/api";
import { PropertyJoinAgent } from "@/lib/types";
import { env } from "@/lib/env";

export const createPropertiesSchema = (
  properties: PropertyJoinAgent[],
  searchParams: FindPropertyQuery,
) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        name: generateTitle(searchParams),
        description: generateDescription(searchParams),
        primaryImageOfPage:
          properties.length > 0
            ? `${env.NEXT_PUBLIC_S3_ENDPOINT}${properties[0][0].images[0].path}`
            : `${env.NEXT_PUBLIC_HOST_URL}/images/primepro-with-full-text.png`,
        url: `${env.NEXT_PUBLIC_HOST_URL}/properties`,
      },
      ...properties?.map((property) => {
        return {
          "@type": "SingleFamilyResidence",
          address: {
            "@type": "PostalAddress",
            addressCountry: "ID",
            addressLocality:
              `${property[0].street}, ${property[0].regency}`.replaceAll(
                "-",
                " ",
              ),
            addressRegion: property[0].province.replaceAll("-", " "),
          },
          name: property[0].title,
          description: property[0].description.replaceAll("\n", " "),
          image: [
            `${env.NEXT_PUBLIC_S3_ENDPOINT}${property[0].images[0].path}`,
          ],
          url: `${env.NEXT_PUBLIC_HOST_URL}/properties/${property[0].id}`,
        };
      }),
    ],
  };
  return jsonLd;
};
