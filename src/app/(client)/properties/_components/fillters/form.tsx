"use client";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FilterSort } from "./sort";
import { PropertyTypeFilter } from "./property-type-filter";
import { MdWhatsapp } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAskUrl } from "@/lib/create-ask-url";
import { sendGAEvent } from "@next/third-parties/google";
import { PurchaseStatusFilter } from "./purchase-status-filter";
import { ProvinceFilter } from "./province-filter";
import { RegencyFilter } from "./regency-filter";
import { StreetFilter } from "./street-filter";
import { FindPropertyQuery } from "@/lib/api";
import { PropertyNavigation, PropertyPurchaseStatus } from "@/lib/types";
import qs from 'qs';

type FilterFormProps = {
  searchParams: FindPropertyQuery;
  propertyNavigations?: PropertyNavigation[] | null;
};

export const FilterForm = ({
  searchParams,
  propertyNavigations,
}: FilterFormProps) => {
  const router = useRouter();
  const [filterParams, setFilterParams] =
    useState<FindPropertyQuery>(searchParams);

  const onSearchClick = () => {
    sendGAEvent("event", "filter_submit");
    const newParams = new URLSearchParams(filterParams as Record<string, string>);
    newParams.set("page", "1");
    router.replace(`/properties?${newParams}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="md:grid md:grid-cols-3 gap-4">
        <PropertyTypeFilter
          defaultValue={searchParams.building_type}
          propertyNavigations={propertyNavigations}
          onValueChange={(building_type) => {
            setFilterParams({
              ...filterParams,
              building_type,
            });
          }}
        />
        <PurchaseStatusFilter
          defaultValue={
            searchParams.purchase_status as PropertyPurchaseStatus | undefined
          }
          onValueChange={(purchase_status) => {
            setFilterParams({
              ...filterParams,
              purchase_status,
            });
          }}
        />
        <FilterSort
          defaultValue={searchParams.sort}
          onValueChange={(val) => {
            setFilterParams({
              ...filterParams,
              sort: val === "Newest" ? "" : val,
            });
          }}
        />
        <ProvinceFilter
          defaultValue={searchParams.province}
          propertyNavigations={propertyNavigations}
          onProvinceChange={(province) =>
            setFilterParams({
              ...filterParams,
              province,
              regency: "",
              street: "",
            })
          }
        />
        <RegencyFilter
          province={filterParams.province}
          defaultValue={filterParams.regency}
          propertyNavigations={propertyNavigations}
          onValueChange={(regency) =>
            setFilterParams({ ...filterParams, regency, street: "" })
          }
        />
        <StreetFilter
          regency={filterParams.regency}
          defaultValue={filterParams.street}
          propertyNavigations={propertyNavigations}
          onValueChange={(street) =>
            setFilterParams({ ...filterParams, street })
          }
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <Link
          href={createAskUrl()}
          target="_blank"
          className={cn(buttonVariants({ variant: "outline" }))}
          title="Tanya Agen"
          aria-label="Tanya Agen"
        >
          <MdWhatsapp />
          Tanya Agen
        </Link>
        <DialogClose className={cn(buttonVariants())} onClick={onSearchClick}>
          Tampilkan Hasil
        </DialogClose>
      </div>
    </div>
  );
};
