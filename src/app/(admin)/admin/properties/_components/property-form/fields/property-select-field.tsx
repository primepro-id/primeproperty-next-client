"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyFormValues } from "../../../_lib/property-form-domain";
import { Controller, type Control, type FieldPath } from "react-hook-form";

const EMPTY_VALUE = "__none__";

export type PropertySelectOption = {
  value: string;
  label: string;
};

type PropertySelectFieldProps = {
  control: Control<PropertyFormValues>;
  name: FieldPath<PropertyFormValues>;
  label: string;
  options: PropertySelectOption[];
  placeholder: string;
  description?: string;
  disabled?: boolean;
  allowEmpty?: boolean;
  onValueChange?: (value: string | null) => void;
};

export function PropertySelectField({
  control,
  name,
  label,
  options,
  placeholder,
  description,
  disabled = false,
  allowEmpty = false,
  onValueChange,
}: PropertySelectFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = (field.value as string | null | undefined) ?? "";

        return (
          <Field data-invalid={fieldState.invalid} data-disabled={disabled}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Select
              name={field.name}
              value={value || undefined}
              disabled={disabled}
              onValueChange={(nextValue) => {
                const normalizedValue =
                  nextValue === EMPTY_VALUE ? null : nextValue;
                field.onChange(normalizedValue);
                onValueChange?.(normalizedValue);
              }}
            >
              <SelectTrigger id={name} aria-invalid={fieldState.invalid}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {allowEmpty ? (
                    <SelectItem value={EMPTY_VALUE}>None</SelectItem>
                  ) : null}
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {description ? (
              <FieldDescription>{description}</FieldDescription>
            ) : null}
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        );
      }}
    />
  );
}
