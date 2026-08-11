import {
  DataAndPagination,
  JsonResponse,
  Property,
  PropertyBuildingCondition,
  PropertyConfigurations,
  PropertyCurrency,
  PropertyFacilities,
  PropertyFurnitureCapacity,
  PropertyImage,
  PropertyJoinAgent,
  PropertyMeasurements,
  PropertyNavigation,
  PropertyPurchaseStatus,
  PropertyRentTime,
  PropertySoldChannel,
  PropertySoldStatus,
  PropertySpecifications,
} from "../types";
import { fetchJsonApi } from "./fetch-api";
import { getAccessToken } from "./token";
import qs from "qs";

export enum FindQuerySort {
  LowestPrice = "LowestPrice",
  HighestPrice = "HighestPrice",
}

// Request Query & Payloads
export type FindPropertyQuery = {
  id?: number;
  agent_id?: string;
  province?: string;
  regency?: string;
  street?: string;
  purchase_status?: PropertyPurchaseStatus;
  sold_status?: PropertySoldStatus;
  building_type?: string;
  building_condition?: PropertyBuildingCondition;
  keyword?: string;
  is_popular?: boolean;
  is_prime?: boolean;
  is_related?: boolean;
  page?: number;
  limit?: number;
  sort?: FindQuerySort;
};

export type CreatePropertyPayload = {
  title: string;
  description: string;
  province: string;
  regency: string;
  street: string;
  gmap_iframe?: string;
  price: number;
  images: PropertyImage[];
  purchase_status: PropertyPurchaseStatus;
  measurements: PropertyMeasurements;
  building_type: string;
  building_condition: PropertyBuildingCondition;
  building_furniture_capacity?: PropertyFurnitureCapacity;
  building_certificate: string;
  specifications: PropertySpecifications;
  facilities: PropertyFacilities[];
  configurations: PropertyConfigurations;
  currency: PropertyCurrency;
  rent_time?: PropertyRentTime;
  price_down_payment?: number;
};

export type UpdatePropertyPayload = {
  title?: string;
  description?: string;
  province?: string;
  regency?: string;
  street?: string;
  gmap_iframe?: string;
  price?: number;
  images?: PropertyImage[];
  purchase_status?: PropertyPurchaseStatus;
  sold_status?: PropertySoldStatus;
  measurements?: PropertyMeasurements;
  building_type?: string;
  building_condition?: PropertyBuildingCondition;
  building_furniture_capacity?: PropertyFurnitureCapacity;
  building_certificate?: string;
  specifications?: PropertySpecifications;
  facilities?: PropertyFacilities[];
  sold_channel?: PropertySoldChannel;
  configurations?: PropertyConfigurations;
  currency?: PropertyCurrency;
  rent_time?: PropertyRentTime;
  price_down_payment?: number;
};

/**
 * Public Routes
 */

export const findUniquePropertyJoinAgent = async (
  id: number,
): Promise<JsonResponse<PropertyJoinAgent>> => {
  return fetchJsonApi(`/properties/${id}/join-agents`, {
    method: "GET",
  });
};

export const findPropertyJoinAgent = async (
  query: FindPropertyQuery = {},
): Promise<DataAndPagination<PropertyJoinAgent[]>> => {
  const searchParams = qs.stringify(query, { addQueryPrefix: true });
  const endpoint = `/properties/join-agents${searchParams}`;

  return fetchJsonApi(endpoint, {
    method: "GET",
  });
};

export const findPropertySitePaths = async (): Promise<JsonResponse<string[]>> => {
  return fetchJsonApi("/properties/site-paths", {
    method: "GET",
  });
};

export const findPropertyNavigation = async (): Promise<
  JsonResponse<PropertyNavigation[]>
> => {
  return fetchJsonApi("/properties/navigations", {
    method: "GET",
  });
};

/**
 * Session Protected Routes
 */

export const createProperty = async (
  payload: CreatePropertyPayload,
): Promise<JsonResponse<Property>> => {
  return fetchJsonApi("/properties", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "x-access-token": await getAccessToken(),
    },
  });
};

export const updateProperty = async (
  id: number,
  payload: UpdatePropertyPayload,
): Promise<JsonResponse<Property>> => {
  return fetchJsonApi(`/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "x-access-token": await getAccessToken(),
    },
  });
};

export const removeProperty = async (
  id: number,
): Promise<JsonResponse<Property>> => {
  return fetchJsonApi(`/properties/${id}`, {
    method: "DELETE",
    headers: {
      "x-access-token": await getAccessToken(),
    },
  });
};
