"use client";

import { PropertySelectFilter } from "./property-select-filter";

type ProvinceFilterProps = {
  value?: string;
  options: string[];
  disabled?: boolean;
  onValueChange: (value?: string) => void;
};

export function ProvinceFilter({
  value,
  options,
  disabled,
  onValueChange,
}: ProvinceFilterProps) {
  return (
    <PropertySelectFilter
      id="province"
      label="Province"
      placeholder="All provinces"
      value={value}
      options={options.map((option) => ({ label: option, value: option }))}
      disabled={disabled}
      onValueChange={onValueChange}
    />
  );
}
