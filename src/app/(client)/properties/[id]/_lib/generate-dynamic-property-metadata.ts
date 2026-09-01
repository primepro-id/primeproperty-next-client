import { findUniquePropertyJoinAgent } from "@/lib/api";
import { env } from "@/lib/env";
import { createMetadata } from "@/lib/metadata";
import {
  createPropertyPath,
  normalizeSeoText,
} from "@/lib/metadata/seo-domain";
import type { Metadata } from "next";

export async function generateDynamicPropertyMetadata(
  params: Promise<{ id: string }>,
): Promise<Metadata> {
  const { id } = await params;
  const [propertyId] = id.split("-");
  const response = await findUniquePropertyJoinAgent(Number(propertyId));
  const property = response.data?.[0];

  if (!property) {
    return createMetadata({
      title: "Properti tidak ditemukan | PrimePro Indonesia",
      description: "Properti yang Anda cari tidak tersedia.",
      path: `/properties/${id}`,
      index: false,
    });
  }

  const coverImage =
    property.images.find((image) => image.is_cover) || property.images[0];

  return createMetadata({
    title: normalizeSeoText(
      `${property.title} | PrimePro Indonesia`,
      70,
    ),
    description: normalizeSeoText(
      property.description_seo || property.description,
      160,
    ),
    path: createPropertyPath(property),
    image: coverImage
      ? `${env.NEXT_PUBLIC_S3_ENDPOINT}${coverImage.path}`
      : undefined,
  });
}
