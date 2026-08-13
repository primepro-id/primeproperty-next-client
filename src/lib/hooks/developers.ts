import {
  queryOptions,
  mutationOptions,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  getDevelopers,
  getDeveloperById,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
} from "../api"; // adjust import path as needed
import { DataAndPagination, Developer, JsonResponse } from "../types";

// ==========================================
// Query Keys
// ==========================================
export const developerKeys = {
  all: ["developers"] as const,
  lists: () => [...developerKeys.all, "list"] as const,
  details: () => [...developerKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...developerKeys.details(), String(id)] as const,
};

// ==========================================
// Query Options
// ==========================================

/**
 * Query options for fetching all developers.
 */
export function developersQueryOptions<
  TData = JsonResponse<DataAndPagination<Developer[]>>,
>(
  options?: Omit<
    UseQueryOptions<
      JsonResponse<DataAndPagination<Developer[]>>,
      Error,
      TData
    >,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: developerKeys.lists(),
    queryFn: getDevelopers,
    ...options,
  });
}

/**
 * Query options for fetching a single developer by ID.
 */
export function developerByIdQueryOptions<TData = JsonResponse<Developer>>(
  id: string | number,
  options?: Omit<
    UseQueryOptions<JsonResponse<Developer>, Error, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: developerKeys.detail(id),
    queryFn: () => getDeveloperById(id),
    enabled: !!id, // Prevent running if id is missing/falsy
    ...options,
  });
}

// ==========================================
// Mutation Options
// ==========================================

/**
 * Mutation options for creating a developer.
 */
export function createDeveloperMutationOptions(
  options?: UseMutationOptions<
    JsonResponse<Developer>,
    Error,
    Parameters<typeof createDeveloper>[0]
  >,
) {
  return mutationOptions({
    mutationFn: createDeveloper,
    ...options,
  });
}

/**
 * Mutation options for updating an existing developer.
 */
export function updateDeveloperMutationOptions(
  options?: UseMutationOptions<
    JsonResponse<Developer>,
    Error,
    { id: string | number; payload: Parameters<typeof updateDeveloper>[1] }
  >,
) {
  return mutationOptions({
    mutationFn: ({ id, payload }) => updateDeveloper(id, payload),
    ...options,
  });
}

/**
 * Mutation options for deleting a developer.
 */
export function deleteDeveloperMutationOptions(
  options?: UseMutationOptions<JsonResponse<Developer>, Error, string | number>,
) {
  return mutationOptions({
    mutationFn: (id) => deleteDeveloper(id),
    ...options,
  });
}
