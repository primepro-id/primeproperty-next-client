"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

type PopularFilterProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function PopularFilter({
  checked,
  onCheckedChange,
}: PopularFilterProps) {
  return (
    <Field orientation="horizontal" className="self-end py-2">
      <Checkbox
        id="popular-properties"
        checked={checked}
        onCheckedChange={(nextChecked) => onCheckedChange(nextChecked === true)}
      />
      <FieldLabel htmlFor="popular-properties">Popular properties</FieldLabel>
    </Field>
  );
}
