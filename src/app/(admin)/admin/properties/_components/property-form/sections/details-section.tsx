"use client";

import { FieldGroup } from "@/components/ui/field";
import type { Control } from "react-hook-form";
import type { PropertyFormValues } from "../../../_lib/property-form-domain";
import { PropertyFacilitiesField } from "../fields/property-facilities-field";
import { PropertyInputField } from "../fields/property-input-field";
import { PropertySectionCard } from "../property-section-card";

type DetailsSectionProps = {
  control: Control<PropertyFormValues>;
};

export function DetailsSection({ control }: DetailsSectionProps) {
  return (
    <PropertySectionCard
      title="Property details"
      description="Add measurements, room counts, utilities, and nearby facilities."
      className="lg:col-span-2"
    >
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PropertyInputField
            control={control}
            name="measurements.land_area"
            label="Land area (m²)"
            type="number"
            min={0}
            step={1}
            numeric
          />
          <PropertyInputField
            control={control}
            name="measurements.building_area"
            label="Building area (m²)"
            type="number"
            min={0}
            step={1}
            numeric
          />
          <PropertyInputField
            control={control}
            name="measurements.building_level"
            label="Building levels"
            type="number"
            min={0}
            step={1}
            numeric
          />
          <PropertyInputField
            control={control}
            name="specifications.electrical_power"
            label="Electrical power (watt)"
            type="number"
            min={0}
            step={1}
            numeric
          />
          <PropertyInputField
            control={control}
            name="specifications.bedrooms"
            label="Bedrooms"
            type="number"
            min={0}
            step={1}
            numeric
          />
          <PropertyInputField
            control={control}
            name="specifications.bathrooms"
            label="Bathrooms"
            type="number"
            min={0}
            step={1}
            numeric
          />
          <PropertyInputField
            control={control}
            name="specifications.garage"
            label="Garage (cars)"
            type="number"
            min={0}
            step={1}
            numeric
          />
          <PropertyInputField
            control={control}
            name="specifications.carport"
            label="Carport (cars)"
            type="number"
            min={0}
            step={1}
            numeric
          />
        </div>
        <PropertyFacilitiesField control={control} />
      </FieldGroup>
    </PropertySectionCard>
  );
}
