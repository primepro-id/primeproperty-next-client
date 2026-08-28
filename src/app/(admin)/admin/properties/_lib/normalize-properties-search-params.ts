import type { FindPropertyQuery } from "@/lib/api";

export type PropertiesSearchParams = Record<
  string,
  string | string[] | undefined
>;

const PURCHASE_STATUSES = ["ForSale", "ForRent", "ForSaleOrRent"] as const;
const SOLD_STATUSES = ["Available", "Sold"] as const;
const PAGE_LIMITS = [10, 25, 50] as const;

function getString(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized || undefined;
}

function getPositiveInteger(value: string | string[] | undefined) {
  const normalized = getString(value);
  if (!normalized || !/^\d+$/.test(normalized)) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function normalizePropertiesSearchParams(
  searchParams: PropertiesSearchParams,
): FindPropertyQuery {
  const query: FindPropertyQuery = {
    page: getPositiveInteger(searchParams.page) ?? 1,
    limit: 10,
  };
  const requestedLimit = getPositiveInteger(searchParams.limit);

  if (PAGE_LIMITS.some((limit) => limit === requestedLimit)) {
    query.limit = requestedLimit;
  }

  const id = getPositiveInteger(searchParams.id);
  if (id) {
    query.id = id;
  }

  const textFilters = [
    "province",
    "regency",
    "street",
    "building_type",
  ] as const;

  for (const filter of textFilters) {
    const value = getString(searchParams[filter]);
    if (value) {
      query[filter] = value;
    }
  }

  const purchaseStatus = getString(searchParams.purchase_status);
  if (PURCHASE_STATUSES.some((status) => status === purchaseStatus)) {
    query.purchase_status =
      purchaseStatus as FindPropertyQuery["purchase_status"];
  }

  const soldStatus = getString(searchParams.sold_status);
  if (SOLD_STATUSES.some((status) => status === soldStatus)) {
    query.sold_status = soldStatus as FindPropertyQuery["sold_status"];
  }

  if (getString(searchParams.is_popular) === "true") {
    query.is_popular = true;
  }

  return query;
}
