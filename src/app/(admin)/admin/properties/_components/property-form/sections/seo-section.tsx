"use client";

import { FieldGroup } from "@/components/ui/field";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { useWatch, type Control } from "react-hook-form";
import {
  normalizeGoogleMapsIframe,
  type PropertyFormValues,
  type PropertyNavigationOptions,
} from "../../../_lib/property-form-domain";
import { PropertyCreatableComboboxField } from "../fields/property-creatable-combobox-field";
import { PropertyInputField } from "../fields/property-input-field";
import { PropertyTextareaField } from "../fields/property-textarea-field";
import { PropertySectionCard } from "../property-section-card";

type SeoSectionProps = {
  control: Control<PropertyFormValues>;
  options: PropertyNavigationOptions;
};

const mapHelp: ReactNode = (
  <>
    Optional. Paste the Google Maps embed iframe. Follow the{" "}
    <a
      href="https://tutorial.idwebhost.com/cara-mendapatkan-kode-embed-google-maps"
      target="_blank"
      rel="noreferrer"
    >
      embed-code tutorial
    </a>
    .
  </>
);

export function SeoSection({ control, options }: SeoSectionProps) {
  const iframe = useWatch({ control, name: "gmap_iframe" });
  const normalizedMap = useMemo(() => {
    try {
      return normalizeGoogleMapsIframe(iframe);
    } catch {
      return null;
    }
  }, [iframe]);

  return (
    <PropertySectionCard
      title="SEO & location"
      description="Create the listing headline, description, and searchable address."
      className="lg:col-span-2"
    >
      <FieldGroup>
        <PropertyInputField
          control={control}
          name="title"
          label="Title"
          placeholder="Modern family home in Kemang"
        />
        <PropertyTextareaField
          control={control}
          name="description"
          label="Description"
          placeholder="Describe the property, its surroundings, and key selling points."
          rows={6}
        />
        <div className="grid gap-6 md:grid-cols-3">
          <PropertyCreatableComboboxField
            control={control}
            name="province"
            label="Province"
            placeholder="Select or enter province"
            options={options.provinces}
          />
          <PropertyCreatableComboboxField
            control={control}
            name="regency"
            label="Regency"
            placeholder="Select or enter regency"
            options={options.regencies}
          />
          <PropertyCreatableComboboxField
            control={control}
            name="street"
            label="Street"
            placeholder="Select or enter street"
            options={options.streets}
          />
        </div>
        <PropertyTextareaField
          control={control}
          name="gmap_iframe"
          label="Google Maps iframe"
          description={mapHelp}
          placeholder={
            '<iframe src="https://www.google.com/maps/embed?...\"></iframe>'
          }
          rows={4}
        />
        <div className="flex aspect-video min-h-48 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/30">
          {normalizedMap ? (
            <iframe
              title="Google Maps preview"
              src={normalizedMap.src}
              className="size-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <p className="px-6 text-center text-sm text-muted-foreground">
              A valid Google Maps embed preview will appear here.
            </p>
          )}
        </div>
      </FieldGroup>
    </PropertySectionCard>
  );
}
