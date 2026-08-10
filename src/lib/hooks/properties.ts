import {
  queryOptions,
  mutationOptions,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  findUniqueJoinAgent,
  findJoinAgent,
  findSitePaths,
  findNavigation,
  createProperty,
  updateProperty,
  removeProperty,
  FindQuery,
  CreatePropertyPayload,
  UpdatePropertyPayload,
} from "../api"; // adjust import path as needed

// Query Key Factory for clear cache scoping
export const propertyKeys = {
  all: ["properties"] as const,
  joinAgents: () => [...propertyKeys.all, "join-agents"] as const,
  joinAgentList: (query?: FindQuery) => [...propertyKeys.joinAgents(), { query }] as const,
  joinAgentDetail: (id: number) => [...propertyKeys.joinAgents(), id] as const,
  sitePaths: () => [...propertyKeys.all, "site-paths"] as const,
  navigations: () => [...propertyKeys.all, "navigations"] as const,
};

/**
 * Query Options
 */

export const findUniqueJoinAgentQueryOptions = (
  id: number,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof findUniqueJoinAgent>>>,
    "queryKey" | "queryFn"
  >
) =>
  queryOptions({
    queryKey: propertyKeys.joinAgentDetail(id),
    queryFn: () => findUniqueJoinAgent(id),
    ...options,
  });

export const findJoinAgentQueryOptions = (
  query: FindQuery = {},
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof findJoinAgent>>>,
    "queryKey" | "queryFn"
  >
) =>
  queryOptions({
    queryKey: propertyKeys.joinAgentList(query),
    queryFn: () => findJoinAgent(query),
    ...options,
  });

export const findSitePathsQueryOptions = (
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof findSitePaths>>>,
    "queryKey" | "queryFn"
  >
) =>
  queryOptions({
    queryKey: propertyKeys.sitePaths(),
    queryFn: () => findSitePaths(),
    ...options,
  });

export const findNavigationQueryOptions = (
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof findNavigation>>>,
    "queryKey" | "queryFn"
  >
) =>
  queryOptions({
    queryKey: propertyKeys.navigations(),
    queryFn: () => findNavigation(),
    ...options,
  });

/**
 * Mutation Options
 */

export const createPropertyMutationOptions = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof createProperty>>,
    Error,
    CreatePropertyPayload
  >
) =>
  mutationOptions({
    mutationFn: (payload: CreatePropertyPayload) => createProperty(payload),
    ...options,
  });

export const updatePropertyMutationOptions = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof updateProperty>>,
    Error,
    { id: number; payload: UpdatePropertyPayload }
  >
) =>
  mutationOptions({
    mutationFn: ({ id, payload }) => updateProperty(id, payload),
    ...options,
  });

export const removePropertyMutationOptions = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof removeProperty>>,
    Error,
    number
  >
) =>
  mutationOptions({
    mutationFn: (id: number) => removeProperty(id),
    ...options,
  });
