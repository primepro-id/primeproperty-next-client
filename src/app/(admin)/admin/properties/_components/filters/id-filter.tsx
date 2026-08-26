"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type IdFilterProps = {
  value?: number;
  onValueChange: (value?: number) => void;
};

export function IdFilter({ value, onValueChange }: IdFilterProps) {
  const [draftValue, setDraftValue] = useState(value ? String(value) : "");

  useEffect(() => {
    setDraftValue(value ? String(value) : "");
  }, [value]);

  useEffect(() => {
    const parsedValue = Number(draftValue);
    const nextValue =
      /^\d+$/.test(draftValue) && Number.isSafeInteger(parsedValue)
        ? parsedValue
        : undefined;

    if ((value ?? undefined) === nextValue) {
      return;
    }

    const timeout = window.setTimeout(() => onValueChange(nextValue), 500);
    return () => window.clearTimeout(timeout);
  }, [draftValue, onValueChange, value]);

  return (
    <Field>
      <FieldLabel htmlFor="property-id">Property ID</FieldLabel>
      <Input
        id="property-id"
        inputMode="numeric"
        min={1}
        pattern="[0-9]*"
        placeholder="Search by ID"
        type="text"
        value={draftValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          const parsedValue = Number(nextValue);
          if (
            nextValue === "" ||
            (/^\d+$/.test(nextValue) &&
              Number.isSafeInteger(parsedValue) &&
              parsedValue > 0)
          ) {
            setDraftValue(nextValue);
          }
        }}
      />
    </Field>
  );
}
