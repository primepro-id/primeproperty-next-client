"use client";

import { FieldGroup } from "@/components/ui/field";
import type { FindPropertyQuery } from "@/lib/api";
import type { PropertyPurchaseStatus, PropertySoldStatus } from "@/lib/types";
import type { PropertyFilterOptions } from "../../_lib/extract-property-filter-options";
import type { PropertySearchParamsUpdater } from "../../_lib/update-property-search-params";
import { BuildingTypeFilter } from "./building-type-filter";
import { IdFilter } from "./id-filter";
import { ProvinceFilter } from "./province-filter";
import { PurchaseStatusFilter } from "./purchase-status-filter";
import { RegencyFilter } from "./regency-filter";
import { SoldStatusFilter } from "./sold-status-filter";
import { StreetFilter } from "./street-filter";

type PropertiesFiltersProps = {
  query: FindPropertyQuery;
  options: PropertyFilterOptions;
  dynamicFiltersDisabled: boolean;
  updateSearchParams: PropertySearchParamsUpdater;
};

export function PropertiesFilters({
  query,
  options,
  dynamicFiltersDisabled,
  updateSearchParams,
}: PropertiesFiltersProps) {
  const updateFilter = (key: string, value?: string | number) =>
    updateSearchParams({ [key]: value }, true);

  return (
    <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <IdFilter
        value={query.id}
        onValueChange={(value) => updateFilter("id", value)}
      />
      <ProvinceFilter
        value={query.province}
        options={options.provinces}
        disabled={dynamicFiltersDisabled}
        onValueChange={(value) => updateFilter("province", value)}
      />
      <RegencyFilter
        value={query.regency}
        options={options.regencies}
        disabled={dynamicFiltersDisabled}
        onValueChange={(value) => updateFilter("regency", value)}
      />
      <StreetFilter
        value={query.street}
        options={options.streets}
        disabled={dynamicFiltersDisabled}
        onValueChange={(value) => updateFilter("street", value)}
      />
      <BuildingTypeFilter
        value={query.building_type}
        options={options.buildingTypes}
        disabled={dynamicFiltersDisabled}
        onValueChange={(value) => updateFilter("building_type", value)}
      />
      <PurchaseStatusFilter
        value={query.purchase_status}
        onValueChange={(value: PropertyPurchaseStatus | undefined) =>
          updateFilter("purchase_status", value)
        }
      />
      <SoldStatusFilter
        value={query.sold_status}
        onValueChange={(value: PropertySoldStatus | undefined) =>
          updateFilter("sold_status", value)
        }
      />
    </FieldGroup>
  );
}
