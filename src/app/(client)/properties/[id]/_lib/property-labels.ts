import {
  PROPERTY_BUILDING_CONDITIONS,
  PropertyPurchaseStatus,
  PropertyRentTime,
  type Property,
} from "@/lib/types";

export const PROPERTY_SECTION_IDS = {
  description: "deskripsi",
  specifications: "spesifikasi",
  facilities: "fasilitas",
  location: "lokasi",
} as const;

export const PROPERTY_GALLERY_ID = "property-gallery";

const RENT_TIME_LABELS: Record<PropertyRentTime, string> = {
  [PropertyRentTime.Monthly]: "/ bulan",
  [PropertyRentTime.Yearly]: "/ tahun",
};

const PURCHASE_STATUS_LABELS: Record<PropertyPurchaseStatus, string> = {
  [PropertyPurchaseStatus.ForSale]: "Dijual",
  [PropertyPurchaseStatus.ForRent]: "Disewa",
  [PropertyPurchaseStatus.ForSaleOrRent]: "Dijual / Disewa",
};

const PURCHASE_STATUS_SENTENCES: Record<PropertyPurchaseStatus, string> = {
  [PropertyPurchaseStatus.ForSale]: "dijual",
  [PropertyPurchaseStatus.ForRent]: "disewakan",
  [PropertyPurchaseStatus.ForSaleOrRent]: "dijual atau disewakan",
};

export function toTitleCase(text: string) {
  return text
    .replaceAll("-", " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getRentTimeLabel(property: Property) {
  if (
    property.purchase_status === PropertyPurchaseStatus.ForSale ||
    !property.rent_time
  ) {
    return null;
  }
  return RENT_TIME_LABELS[property.rent_time] ?? null;
}

export function getPurchaseStatusLabel(status: PropertyPurchaseStatus) {
  return PURCHASE_STATUS_LABELS[status] ?? "Dijual";
}

export function getPurchaseStatusSentence(status: PropertyPurchaseStatus) {
  return PURCHASE_STATUS_SENTENCES[status] ?? "dijual";
}

export function formatPropertyLocation(property: Property) {
  return [property.street, property.regency]
    .filter(Boolean)
    .map(toTitleCase)
    .join(", ");
}

export function getBuildingConditionLabel(property: Property) {
  return PROPERTY_BUILDING_CONDITIONS[property.building_condition] ?? null;
}
