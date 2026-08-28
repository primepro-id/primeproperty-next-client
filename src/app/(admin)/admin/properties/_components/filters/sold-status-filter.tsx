"use client";

import { PropertySoldStatus } from "@/lib/types";
import { PropertySelectFilter } from "./property-select-filter";

const SOLD_STATUS_OPTIONS = [
  { label: "Tersedia", value: PropertySoldStatus.Available },
  { label: "Terjual", value: PropertySoldStatus.Sold },
];

type SoldStatusFilterProps = {
  value?: PropertySoldStatus;
  onValueChange: (value?: PropertySoldStatus) => void;
};

export function SoldStatusFilter({
  value,
  onValueChange,
}: SoldStatusFilterProps) {
  return (
    <PropertySelectFilter
      id="sold-status"
      label="Sold status"
      placeholder="All sold status"
      value={value}
      options={SOLD_STATUS_OPTIONS}
      onValueChange={(nextValue) =>
        onValueChange(nextValue as PropertySoldStatus | undefined)
      }
    />
  );
}
