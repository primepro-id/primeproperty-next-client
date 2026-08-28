"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import type { PropertyFormValues } from "../../../_lib/property-form-domain";

type LocationFieldName = "province" | "regency" | "street";

type PropertyCreatableComboboxFieldProps = {
  control: Control<PropertyFormValues>;
  name: LocationFieldName;
  label: string;
  placeholder: string;
  options: string[];
};

export function PropertyCreatableComboboxField({
  control,
  name,
  label,
  placeholder,
  options,
}: PropertyCreatableComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = field.value;
        const trimmedSearch = search.trim();
        const hasExactOption = options.some(
          (option) =>
            option.toLocaleLowerCase("id-ID") ===
            trimmedSearch.toLocaleLowerCase("id-ID"),
        );

        const chooseValue = (nextValue: string) => {
          field.onChange(nextValue.trim());
          setSearch("");
          setOpen(false);
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Popover
              open={open}
              onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (nextOpen) setSearch(value);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  id={name}
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-invalid={fieldState.invalid}
                  className="w-full justify-between font-normal"
                >
                  <span className="truncate">{value || placeholder}</span>
                  <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[var(--radix-popover-trigger-width)] p-0"
              >
                <Command shouldFilter>
                  <CommandInput
                    value={search}
                    onValueChange={setSearch}
                    placeholder={`Search or enter ${label.toLocaleLowerCase("en-US")}`}
                  />
                  <CommandList>
                    <CommandEmpty>No existing option found.</CommandEmpty>
                    <CommandGroup>
                      {trimmedSearch && !hasExactOption ? (
                        <CommandItem
                          value={`create-${trimmedSearch}`}
                          onSelect={() => chooseValue(trimmedSearch)}
                        >
                          <PlusIcon />
                          Use “{trimmedSearch}”
                        </CommandItem>
                      ) : null}
                      {options.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => chooseValue(option)}
                        >
                          {value === option ? <CheckIcon /> : null}
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        );
      }}
    />
  );
}
