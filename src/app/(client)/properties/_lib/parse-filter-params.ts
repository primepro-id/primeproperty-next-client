import { FindPropertyQuery } from "@/lib/api";
import { PropertyPurchaseStatus } from "@/lib/types";

export const parseFilterParams = (params: string[]): FindPropertyQuery=> {
  const baseQuery: FindPropertyQuery = {};

  if (params?.[0]) {
    const purchaseStatusQuery = params?.[0] as "dijual" | "disewa";
    switch (purchaseStatusQuery) {
      case "dijual":
        baseQuery.purchase_status = PropertyPurchaseStatus.ForSale;
        break;
      case "disewa":
        baseQuery.purchase_status = PropertyPurchaseStatus.ForRent;
        break;
    }
  }

  if (params?.[1]) {
    const buildingTypeQuery = params?.[1];
    baseQuery.building_type = buildingTypeQuery
      .toLowerCase()
      .replaceAll("-", " ");
  }

  if (params?.[2]) {
    const provinceQuery = params?.[2];
    baseQuery.province = provinceQuery.toLowerCase().replaceAll("-", " ");
  }

  if (params?.[3]) {
    const regencyQuery = params?.[3];
    baseQuery.regency = regencyQuery.toLowerCase().replaceAll("-", " ");
  }

  if (params?.[4]) {
    const streetQuery = params?.[4];
    baseQuery.street = streetQuery.toLowerCase().replaceAll("-", " ");
  }

  return baseQuery;
};
