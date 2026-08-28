"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
  label: string;
  value: string;
};

type PropertySelectFilterProps = {
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  options: SelectOption[];
  disabled?: boolean;
  onValueChange: (value?: string) => void;
};

const ALL_VALUE = "__all__";

export function PropertySelectFilter({
  id,
  label,
  placeholder,
  value,
  options,
  disabled,
  onValueChange,
}: PropertySelectFilterProps) {
  return (
    <Field data-disabled={disabled || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        disabled={disabled}
        value={value ?? ALL_VALUE}
        onValueChange={(nextValue) =>
          onValueChange(nextValue === ALL_VALUE ? undefined : nextValue)
        }
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} className="capitalize" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="capitalize"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
