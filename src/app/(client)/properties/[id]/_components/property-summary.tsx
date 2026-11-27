import { formatToCurrencyUnit } from "@/lib/intl/format-to-currency-unit";
import type { Property } from "@/lib/types";
import {
  getBuildingConditionLabel,
  getPurchaseStatusSentence,
  getRentTimeLabel,
  toTitleCase,
} from "../_lib/property-labels";

type PropertySummaryProps = {
  property: Property;
};

function createPropertySummary(property: Property) {
  const { bedrooms, bathrooms } = property.specifications;
  const { land_area, building_area } = property.measurements;
  const location = [property.street, property.regency, property.province]
    .filter(Boolean)
    .map(toTitleCase)
    .join(", ");
  const rooms = [
    bedrooms > 0 ? `${bedrooms} kamar tidur` : null,
    bathrooms > 0 ? `${bathrooms} kamar mandi` : null,
  ]
    .filter(Boolean)
    .join(" dan ");

  const intro = `${toTitleCase(property.building_type)}${rooms ? ` ${rooms}` : ""} ${getPurchaseStatusSentence(property.purchase_status)} di ${location}.`;

  const condition = getBuildingConditionLabel(property);
  const details = [
    land_area > 0 ? `luas tanah ${land_area.toLocaleString("id-ID")} m²` : null,
    building_area > 0
      ? `luas bangunan ${building_area.toLocaleString("id-ID")} m²`
      : null,
    property.building_certificate
      ? `sertifikat ${property.building_certificate.toUpperCase()}`
      : null,
    condition ? `kondisi ${condition.toLowerCase()}` : null,
  ].filter(Boolean);

  const rentTimeLabel = getRentTimeLabel(property);
  const price = `Ditawarkan seharga ${formatToCurrencyUnit(property.price, property.currency)}${rentTimeLabel ? ` ${rentTimeLabel}` : ""}.`;

  const detailSentence =
    details.length > 0
      ? `${details.join(", ").replace(/^\w/, (letter) => letter.toUpperCase())}.`
      : "";

  return [intro, detailSentence, price].filter(Boolean).join(" ");
}

export const PropertySummary = ({ property }: PropertySummaryProps) => {
  return (
    <p className="text-base leading-relaxed text-muted-foreground">
      {createPropertySummary(property)}
    </p>
  );
};
