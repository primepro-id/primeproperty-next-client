"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { PropertyFormValues } from "../../../_lib/property-form-domain";
import type { ComponentProps } from "react";
import { Controller, type Control, type FieldPath } from "react-hook-form";

type PropertyInputFieldProps = Omit<
  ComponentProps<typeof Input>,
  "defaultValue" | "name" | "onChange" | "value"
> & {
  control: Control<PropertyFormValues>;
  name: FieldPath<PropertyFormValues>;
  label: string;
  description?: string;
  numeric?: boolean;
};

export function PropertyInputField({
  control,
  name,
  label,
  description,
  numeric = false,
  disabled,
  ...inputProps
}: PropertyInputFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} data-disabled={disabled}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...inputProps}
            id={name}
            name={field.name}
            ref={field.ref}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            value={(field.value as string | number | undefined) ?? ""}
            onBlur={field.onBlur}
            onChange={(event) => {
              if (!numeric) {
                field.onChange(event.target.value);
                return;
              }

              field.onChange(
                event.target.value === ""
                  ? undefined
                  : Number(event.target.value),
              );
            }}
          />
          {description ? (
            <FieldDescription>{description}</FieldDescription>
          ) : null}
          {fieldState.invalid ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
}
