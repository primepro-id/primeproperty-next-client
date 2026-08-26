import {
  queryOptions,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { DataAndPagination, JsonResponse, Lead } from "../types";
import { createLead, CreateLeadPayload, FindLeadQuery, getLeads } from "../api";

// Centralized query keys for consistent invalidation
export const leadKeys = {
  all: ["leads"] as const,
  lists: (query: FindLeadQuery = {}) =>
    [...leadKeys.all, "list", { query }] as const,
};

/**
 * Query options for fetching leads.
 * Allows passing additional TanStack Query options to override or extend defaults.
 */
export function getLeadsQueryOptions(
  query: FindLeadQuery = {},
  options?: Omit<
    UseQueryOptions<JsonResponse<DataAndPagination<Lead[]>>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: leadKeys.lists(query),
    queryFn: () => getLeads(query),
    ...options,
  });
}

/**
 * Mutation options for creating a lead.
 * Allows passing additional TanStack Query mutation options (e.g., onSuccess, onError).
 */
export function createLeadMutationOptions(
  options?: UseMutationOptions<JsonResponse<Lead>, Error, CreateLeadPayload>,
) {
  return {
    mutationFn: (payload: CreateLeadPayload) => createLead(payload),
    ...options,
  };
}
