"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  BUILDING_CERTIFICATES,
  BUILDING_TYPES,
  PROPERTY_BUILDING_CONDITIONS,
  PROPERTY_FURNITURE_CAPACITY,
} from "@/lib/types/properties";
import type { Control } from "react-hook-form";
import type { PropertyFormValues } from "../../../_lib/property-form-domain";
import { PropertySelectField } from "../fields/property-select-field";
import { PropertySectionCard } from "../property-section-card";

type StatusSectionProps = {
  control: Control<PropertyFormValues>;
};

const buildingTypeOptions = BUILDING_TYPES.map((value) => ({
  value,
  label: value.replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("id-ID")),
}));

const buildingConditionOptions = Object.entries(
  PROPERTY_BUILDING_CONDITIONS,
).map(([value, label]) => ({ value, label }));

const certificateOptions = BUILDING_CERTIFICATES.map((value) => ({
  value,
  label: value.toLocaleUpperCase("id-ID"),
}));

const furnitureOptions = Object.entries(PROPERTY_FURNITURE_CAPACITY).map(
  ([value, label]) => ({ value, label }),
);

export function StatusSection({ control }: StatusSectionProps) {
  return (
    <PropertySectionCard
      title="Property status"
      description="Describe the building category and its current condition."
    >
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <PropertySelectField
            control={control}
            name="building_type"
            label="Building type"
            placeholder="Choose building type"
            options={buildingTypeOptions}
          />
          <PropertySelectField
            control={control}
            name="building_condition"
            label="Building condition"
            placeholder="Choose building condition"
            options={buildingConditionOptions}
          />
          <PropertySelectField
            control={control}
            name="building_certificate"
            label="Building certificate"
            placeholder="Choose certificate"
            options={certificateOptions}
          />
          <PropertySelectField
            control={control}
            name="building_furniture_capacity"
            label="Furniture capacity"
            placeholder="Choose furniture capacity"
            options={furnitureOptions}
            allowEmpty
          />
        </div>
      </FieldGroup>
    </PropertySectionCard>
  );
}
