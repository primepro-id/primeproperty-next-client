"use client";

import { FieldGroup, FieldSet } from "@/components/ui/field";
import type { AgentRole } from "@/lib/types";
import { useWatch, type UseFormReturn } from "react-hook-form";
import {
  formatCompactPropertyPrice,
  type PropertyFormValues,
} from "../../../_lib/property-form-domain";
import { PropertyCheckboxField } from "../fields/property-checkbox-field";
import { PropertyInputField } from "../fields/property-input-field";
import { PropertySelectField } from "../fields/property-select-field";
import { PropertySectionCard } from "../property-section-card";

type PriceSectionProps = {
  form: UseFormReturn<PropertyFormValues>;
  viewerRole: AgentRole;
};

const purchaseOptions = [
  { value: "ForSale", label: "For sale" },
  { value: "ForRent", label: "For rent" },
];

const rentTimeOptions = [
  { value: "Monthly", label: "Monthly" },
  { value: "Yearly", label: "Yearly" },
];

const currencyOptions = [
  { value: "Idr", label: "IDR — Indonesian rupiah" },
  { value: "Usd", label: "USD — US dollar" },
];

const soldChannelOptions = [
  { value: "Web", label: "Web" },
  { value: "R123", label: "Rumah123" },
  { value: "Socmed", label: "Social media" },
  { value: "Banner", label: "Banner" },
  { value: "Others", label: "Others" },
];

export function PriceSection({ form, viewerRole }: PriceSectionProps) {
  const purchaseStatus = useWatch({
    control: form.control,
    name: "purchase_status",
  });
  const price = useWatch({ control: form.control, name: "price" });
  const downPayment = useWatch({
    control: form.control,
    name: "price_down_payment",
  });
  const currency = useWatch({ control: form.control, name: "currency" });
  const isAdmin = viewerRole === "Admin";

  return (
    <PropertySectionCard
      title="Price details"
      description="Set the commercial terms and how the price is presented."
    >
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <PropertySelectField
            control={form.control}
            name="purchase_status"
            label="Purchase status"
            placeholder="Choose a status"
            options={purchaseOptions}
            onValueChange={(value) => {
              if (value !== "ForRent") {
                form.setValue("rent_time", null, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
          />
          <PropertySelectField
            control={form.control}
            name="rent_time"
            label="Rent time"
            placeholder="Choose rent period"
            options={rentTimeOptions}
            allowEmpty
            disabled={purchaseStatus !== "ForRent"}
          />
          <PropertyInputField
            control={form.control}
            name="price"
            label="Price"
            type="number"
            min={1}
            step={1}
            numeric
            description={
              price > 0
                ? formatCompactPropertyPrice(price, currency)
                : "Enter the full amount without separators."
            }
          />
          <PropertyInputField
            control={form.control}
            name="price_down_payment"
            label="Down payment"
            type="number"
            min={0}
            step={1}
            numeric
            description={
              downPayment >= 0
                ? formatCompactPropertyPrice(downPayment, currency)
                : "A zero down payment is allowed."
            }
          />
          <PropertySelectField
            control={form.control}
            name="currency"
            label="Currency"
            placeholder="Choose currency"
            options={currencyOptions}
          />
          {isAdmin ? (
            <PropertySelectField
              control={form.control}
              name="sold_channel"
              label="Sold channel"
              placeholder="Choose sold channel"
              options={soldChannelOptions}
              allowEmpty
            />
          ) : null}
        </div>
        <FieldSet>
          <FieldGroup data-slot="checkbox-group" className="gap-4">
            <PropertyCheckboxField
              control={form.control}
              name="is_njop_price"
              label="NJOP price"
              description="Mark this listing price as based on NJOP."
            />
            {isAdmin ? (
              <PropertyCheckboxField
                control={form.control}
                name="is_popular"
                label="Popular property"
                description="Feature this property in popular listing areas."
              />
            ) : null}
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </PropertySectionCard>
  );
}
