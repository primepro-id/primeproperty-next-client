"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { PropertyFormValues } from "../../../_lib/property-form-domain";
import type { ComponentProps, ReactNode } from "react";
import { Controller, type Control, type FieldPath } from "react-hook-form";

type PropertyTextareaFieldProps = Omit<
  ComponentProps<typeof Textarea>,
  "defaultValue" | "name" | "onChange" | "value"
> & {
  control: Control<PropertyFormValues>;
  name: FieldPath<PropertyFormValues>;
  label: string;
  description?: ReactNode;
};

export function PropertyTextareaField({
  control,
  name,
  label,
  description,
  ...textareaProps
}: PropertyTextareaFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Textarea
            {...textareaProps}
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            value={(field.value as string | undefined) ?? ""}
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
