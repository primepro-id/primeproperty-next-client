import { findUniquePropertyJoinAgent } from "@/lib/api";
import { env } from "@/lib/env";
import { createMetadata } from "@/lib/metadata";
import {
  createMissingPropertySeoDetails,
  createPropertyPath,
  createPropertySeoDescription,
  normalizeSeoText,
} from "@/lib/metadata/seo-domain";
import type { Metadata } from "next";
import { parsePropertyDetailId } from "../../_lib/parse-property-route-ids";

export async function generateDynamicPropertyMetadata(
  params: Promise<{ id: string }>,
): Promise<Metadata> {
  const { id } = await params;
  const propertyId = parsePropertyDetailId(id);
  if (propertyId === null) {
    return createMetadata({
      ...createMissingPropertySeoDetails(),
      path: `/properties/${id}`,
    });
  }

  const response = await findUniquePropertyJoinAgent(propertyId);
  const property = response.data?.[0];

  if (!property) {
    const missingPropertySeoDetails = createMissingPropertySeoDetails();

    return createMetadata({
      ...missingPropertySeoDetails,
      path: `/properties/${id}`,
    });
  }

  const coverImage =
    property.images.find((image) => image.is_cover) || property.images[0];

  return createMetadata({
    title: normalizeSeoText(`${property.title} | PrimePro Indonesia`, 70),
    description: createPropertySeoDescription({
      title: property.title,
      description: property.description_seo || property.description,
    }),
    path: createPropertyPath(property),
    image: coverImage
      ? `${env.NEXT_PUBLIC_S3_ENDPOINT}${coverImage.path}`
      : undefined,
  });
}
