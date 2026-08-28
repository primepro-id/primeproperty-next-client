import { formatToCurrencyUnit } from "@/lib/intl/format-to-currency-unit";
import {
  type Property,
  PropertyPurchaseStatus,
  PropertyRentTime,
} from "@/lib/types";

const PURCHASE_STATUS_LABELS = {
  [PropertyPurchaseStatus.ForSale]: "Dijual",
  [PropertyPurchaseStatus.ForRent]: "Disewa",
  [PropertyPurchaseStatus.ForSaleOrRent]: "Dijual atau disewa",
};

const RENT_TIME_LABELS = {
  [PropertyRentTime.Monthly]: "/bulan",
  [PropertyRentTime.Yearly]: "/tahun",
};

type PropertyDetailsColumnProps = {
  property: Property;
};

export function PropertyDetailsColumn({
  property,
}: PropertyDetailsColumnProps) {
  const rentTime =
    property.purchase_status === PropertyPurchaseStatus.ForRent &&
    property.rent_time
      ? RENT_TIME_LABELS[property.rent_time]
      : "";

  return (
    <div className="flex min-w-64 flex-col gap-1">
      <span className="font-medium">{property.title}</span>
      <span className="capitalize text-muted-foreground">
        {property.building_type} | {PURCHASE_STATUS_LABELS[property.purchase_status]}
      </span>
      <span>
        {formatToCurrencyUnit(property.price, property.currency)}
        {rentTime}
      </span>
    </div>
  );
}
