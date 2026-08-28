"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FACILITIES } from "@/lib/types";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import type { PropertyFormValues } from "../../../_lib/property-form-domain";

type PropertyFacilitiesFieldProps = {
  control: Control<PropertyFormValues>;
};

export function PropertyFacilitiesField({
  control,
}: PropertyFacilitiesFieldProps) {
  return (
    <Controller
      name="facilities"
      control={control}
      render={({ field, fieldState }) => {
        const selectedValues = new Set(
          field.value.map((facility) => facility.value),
        );

        const toggleFacility = (facility: (typeof FACILITIES)[number]) => {
          field.onChange(
            selectedValues.has(facility.value)
              ? field.value.filter((item) => item.value !== facility.value)
              : [...field.value, facility],
          );
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Facilities</FieldLabel>
            <FieldDescription>
              Select facilities available at or near the property.
            </FieldDescription>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-invalid={fieldState.invalid}
                  className="w-full justify-between font-normal"
                >
                  {field.value.length > 0
                    ? `${field.value.length} selected`
                    : "Select facilities"}
                  <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[var(--radix-popover-trigger-width)] p-0"
              >
                <Command>
                  <CommandInput placeholder="Search facilities" />
                  <CommandList>
                    <CommandEmpty>No facility found.</CommandEmpty>
                    <CommandGroup>
                      {FACILITIES.map((facility) => (
                        <CommandItem
                          key={facility.value}
                          value={`${facility.value} ${facility.indonesian_label}`}
                          onSelect={() => toggleFacility(facility)}
                        >
                          {selectedValues.has(facility.value) ? (
                            <CheckIcon />
                          ) : null}
                          {facility.indonesian_label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {field.value.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {field.value.map((facility) => (
                  <Badge
                    key={facility.value}
                    variant="secondary"
                    className="gap-1"
                  >
                    {facility.indonesian_label}
                    <button
                      type="button"
                      aria-label={`Remove ${facility.indonesian_label}`}
                      onClick={() => toggleFacility(facility)}
                    >
                      <XIcon />
                    </button>
                  </Badge>
                ))}
              </div>
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
