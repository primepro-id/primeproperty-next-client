import { findUniquePropertyJoinAgent } from "@/lib/api";
import { env } from "@/lib/env";
import { Metadata } from "next";

export const generateDynamicPropertyMetadata = async (
  params: Promise<{ id: string }>,
): Promise<Metadata | undefined> => {
  const { id } = await params;
  const [propertyId] = id.split("-");

  const property = await findUniquePropertyJoinAgent(Number(propertyId));
  if (property.data) {
    const title =
      property.data[0].title + `. Property ${propertyId} - PRIMEPRO INDONESIA`;
    return {
      title,
      description: property.data[0].description,
      keywords:
        property.data[0].site_path.replaceAll("-", " ").replaceAll("/", ",") +
        "| PRIMEPRO INDONESIA",
      twitter: {
        title,
        site: "@primeproindonesia",
        creator: "@primeproindonesia",
        card: "summary_large_image",
        images: [`${env.NEXT_PUBLIC_HOST_URL}/images/primepro.png`],
      },
      openGraph: {
        title,
        description: property.data[0].description,
        siteName: "Primepro Indonesia",
        locale: "id_ID",
      },
      appleWebApp: true,
      applicationName: "Primepro Indonesia",
      alternates: {
        canonical: `${env.NEXT_PUBLIC_HOST_URL}/properties/${id}`,
      },
      robots: "index, follow",
    };
  }
  return;
};
