import { FindPropertyQuery } from "@/lib/api";
import { PropertyPurchaseStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { createPropertiesIntroduction } from "../_lib/create-properties-metadata";

type PropertiesTitleProps = {
  propertyCount: number;
  searchParams: FindPropertyQuery;
  className?: string;
};

const purchaseStatusLabels = {
  [PropertyPurchaseStatus.ForSale]: "Dijual",
  [PropertyPurchaseStatus.ForRent]: "Disewa",
  [PropertyPurchaseStatus.ForSaleOrRent]: "Dijual atau disewa",
};

const createLocation = (
  province?: string,
  regency?: string,
  street?: string,
) => {
  if (street) {
    return street;
  }
  if (regency) {
    return regency;
  }
  if (province) {
    return province;
  }

  return "Indonesia";
};

const Title = ({
  propertyCount,
  searchParams,
  className,
}: PropertiesTitleProps) => {
  const baseClassname = "flex gap-1 font-sans flex-wrap uppercase";
  if (
    propertyCount === 0 &&
    Object.values(searchParams).filter((val) => val).length === 0
  ) {
    return (
      <h1 className={cn(baseClassname, className)}>
        Pencarian tidak ditemukan
      </h1>
    );
  }

  const location = createLocation(
    searchParams.province,
    searchParams.regency,
    searchParams.street,
  );
  return (
    <h1 className={cn(baseClassname, className)}>
      {propertyCount === 0 && "Pencarian tidak ditemukan untuk "}
      {searchParams.building_type
        ? searchParams.building_type
        : "properti"}{" "}
      {searchParams.purchase_status
        ? purchaseStatusLabels[searchParams.purchase_status].toLowerCase()
        : ""}{" "}
      {searchParams.province || searchParams.regency || searchParams.street ? (
        <span>{location}</span>
      ) : (
        <span>Primepro Indonesia</span>
      )}
    </h1>
  );
};

export const PropertiesTitle = ({
  propertyCount,
  searchParams,
  className,
}: PropertiesTitleProps) => {
  const showCount = useMemo(() => {
    let startCount = 1;
    let endCount = 30;
    if (searchParams.page && Number(searchParams?.page) > 1) {
      startCount = (Number(searchParams.page) - 1) * 30 + 1;
      endCount = Number(searchParams.page) * 30;
    }

    if (endCount > propertyCount) endCount = propertyCount;

    return `${startCount} - ${endCount}`;
  }, [searchParams.page, propertyCount]);
  return (
    <div className="flex flex-col">
      <Title
        propertyCount={propertyCount}
        searchParams={searchParams}
        className={className}
      />
      {propertyCount > 0 && (
        <>
          <p className="text-muted-foreground">
            Menampilkan {showCount} dari {propertyCount} properti
          </p>
          <p className="text-muted-foreground mt-2 max-w-4xl normal-case">
            {createPropertiesIntroduction(searchParams, propertyCount)}
          </p>
        </>
      )}
    </div>
  );
};
