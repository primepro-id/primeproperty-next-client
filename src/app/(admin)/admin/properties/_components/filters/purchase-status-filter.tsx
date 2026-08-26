"use client";

import { PropertyPurchaseStatus } from "@/lib/types";
import { PropertySelectFilter } from "./property-select-filter";

const PURCHASE_STATUS_OPTIONS = [
  { label: "Dijual", value: PropertyPurchaseStatus.ForSale },
  { label: "Disewa", value: PropertyPurchaseStatus.ForRent },
  {
    label: "Dijual atau disewa",
    value: PropertyPurchaseStatus.ForSaleOrRent,
  },
];

type PurchaseStatusFilterProps = {
  value?: PropertyPurchaseStatus;
  onValueChange: (value?: PropertyPurchaseStatus) => void;
};

export function PurchaseStatusFilter({
  value,
  onValueChange,
}: PurchaseStatusFilterProps) {
  return (
    <PropertySelectFilter
      id="purchase-status"
      label="Purchase status"
      placeholder="All purchase statuses"
      value={value}
      options={PURCHASE_STATUS_OPTIONS}
      onValueChange={(nextValue) =>
        onValueChange(nextValue as PropertyPurchaseStatus | undefined)
      }
    />
  );
}
