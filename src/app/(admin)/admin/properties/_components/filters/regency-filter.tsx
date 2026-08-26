"use client";

import { PropertySelectFilter } from "./property-select-filter";

type RegencyFilterProps = {
  value?: string;
  options: string[];
  disabled?: boolean;
  onValueChange: (value?: string) => void;
};

export function RegencyFilter({
  value,
  options,
  disabled,
  onValueChange,
}: RegencyFilterProps) {
  return (
    <PropertySelectFilter
      id="regency"
      label="Regency"
      placeholder="All regencies"
      value={value}
      options={options.map((option) => ({ label: option, value: option }))}
      disabled={disabled}
      onValueChange={onValueChange}
    />
  );
}
