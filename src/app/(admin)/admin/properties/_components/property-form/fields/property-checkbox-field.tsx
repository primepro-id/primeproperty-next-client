"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Controller, type Control } from "react-hook-form";
import type { PropertyFormValues } from "../../../_lib/property-form-domain";

type CheckboxFieldName = "is_njop_price" | "is_popular";

type PropertyCheckboxFieldProps = {
  control: Control<PropertyFormValues>;
  name: CheckboxFieldName;
  label: string;
  description: string;
};

export function PropertyCheckboxField({
  control,
  name,
  label,
  description,
}: PropertyCheckboxFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <Checkbox
            id={name}
            name={field.name}
            ref={field.ref}
            checked={field.value}
            aria-invalid={fieldState.invalid}
            onBlur={field.onBlur}
            onCheckedChange={(checked) => field.onChange(checked === true)}
          />
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor={name} className="font-normal">
              {label}
            </FieldLabel>
            <FieldDescription>{description}</FieldDescription>
          </div>
        </Field>
      )}
    />
  );
}
