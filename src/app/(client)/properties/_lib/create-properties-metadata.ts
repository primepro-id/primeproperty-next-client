import type { FindPropertyQuery } from "@/lib/api";
import { createMetadata } from "@/lib/metadata";
import { normalizeSeoText } from "@/lib/metadata/seo-domain";
import { PropertyPurchaseStatus } from "@/lib/types";
import { toTitleCase } from "@/lib/to-title-case";
import type { Metadata } from "next";

function getLocation(searchParams: FindPropertyQuery) {
  const locationSegments = [searchParams.street, searchParams.regency]
    .filter(Boolean)
    .map((segment) => segment?.replaceAll("-", " "));

  if (locationSegments.length > 0) {
    return locationSegments.join(", ");
  }

  return searchParams.province?.replaceAll("-", " ") || "Indonesia";
}

function getPurchaseStatus(searchParams: FindPropertyQuery) {
  return searchParams.purchase_status === PropertyPurchaseStatus.ForRent
    ? "disewa"
    : "dijual";
}

export function generateTitle(searchParams: FindPropertyQuery) {
  const propertyType = toTitleCase(searchParams.building_type || "Properti");
  const status = getPurchaseStatus(searchParams);
  const location = toTitleCase(getLocation(searchParams));
  return normalizeSeoText(
    `${propertyType} ${toTitleCase(status)} di ${location} | PrimePro Indonesia`,
    70,
  );
}

export function generateDescription(searchParams: FindPropertyQuery) {
  const propertyType = (searchParams.building_type || "properti").toLowerCase();
  const status = getPurchaseStatus(searchParams);
  const location = toTitleCase(getLocation(searchParams));
  return normalizeSeoText(
    `Temukan ${propertyType} ${status} di ${location}. Lihat pilihan properti PrimePro Indonesia dengan harga, foto, lokasi, dan agen yang dapat dihubungi.`,
    160,
  );
}

export function hasPropertyQuery(searchParams: FindPropertyQuery) {
  return Object.values(searchParams).some(
    (value) => value !== undefined && value !== null && value !== "",
  );
}

export async function generatePropertiesMetadata(
  searchQuery: Promise<FindPropertyQuery>,
): Promise<Metadata> {
  const searchParams = await searchQuery;

  return createMetadata({
    title: generateTitle(searchParams),
    description: generateDescription(searchParams),
    path: "/properties",
    index: !hasPropertyQuery(searchParams),
  });
}
