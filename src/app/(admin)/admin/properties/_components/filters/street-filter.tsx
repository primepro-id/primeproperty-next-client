"use client";

import { PropertySelectFilter } from "./property-select-filter";

type StreetFilterProps = {
  value?: string;
  options: string[];
  disabled?: boolean;
  onValueChange: (value?: string) => void;
};

export function StreetFilter({
  value,
  options,
  disabled,
  onValueChange,
}: StreetFilterProps) {
  return (
    <PropertySelectFilter
      id="street"
      label="Street"
      placeholder="All streets"
      value={value}
      options={options.map((option) => ({ label: option, value: option }))}
      disabled={disabled}
      onValueChange={onValueChange}
    />
  );
}
