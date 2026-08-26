"use client";

import { PropertySelectFilter } from "./property-select-filter";

type BuildingTypeFilterProps = {
  value?: string;
  options: string[];
  disabled?: boolean;
  onValueChange: (value?: string) => void;
};

export function BuildingTypeFilter({
  value,
  options,
  disabled,
  onValueChange,
}: BuildingTypeFilterProps) {
  return (
    <PropertySelectFilter
      id="building-type"
      label="Building type"
      placeholder="All building types"
      value={value}
      options={options.map((option) => ({ label: option, value: option }))}
      disabled={disabled}
      onValueChange={onValueChange}
    />
  );
}
