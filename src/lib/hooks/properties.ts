import {
  queryOptions,
  mutationOptions,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  createProperty,
  updateProperty,
  removeProperty,
  FindPropertyQuery,
  CreatePropertyPayload,
  UpdatePropertyPayload,
  findUniquePropertyJoinAgent,
  findPropertyJoinAgent,
  findPropertySitePaths,
  findPropertyNavigation,
} from "../api"; // adjust import path as needed

// Query Key Factory for clear cache scoping
export const propertyKeys = {
  all: ["properties"] as const,
  joinAgents: () => [...propertyKeys.all, "join-agents"] as const,
  joinAgentList: (query?: FindPropertyQuery) =>
    [...propertyKeys.joinAgents(), { query }] as const,
  joinAgentDetail: (id: number) => [...propertyKeys.joinAgents(), id] as const,
  sitePaths: () => [...propertyKeys.all, "site-paths"] as const,
  navigations: () => [...propertyKeys.all, "navigations"] as const,
};

/**
 * Query Options
 */

export const findUniquePropertyJoinAgentQueryOptions = (
  id: number,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof findUniquePropertyJoinAgent>>>,
    "queryKey" | "queryFn"
  >,
) =>
  queryOptions({
    queryKey: propertyKeys.joinAgentDetail(id),
    queryFn: () => findUniquePropertyJoinAgent(id),
    ...options,
  });

export const findPropertyJoinAgentQueryOptions = (
  query: FindPropertyQuery = {},
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof findPropertyJoinAgent>>>,
    "queryKey" | "queryFn"
  >,
) =>
  queryOptions({
    queryKey: propertyKeys.joinAgentList(query),
    queryFn: () => findPropertyJoinAgent(query),
    ...options,
  });

export const findPropertySitePathsQueryOptions = (
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof findPropertySitePaths>>>,
    "queryKey" | "queryFn"
  >,
) =>
  queryOptions({
    queryKey: propertyKeys.sitePaths(),
    queryFn: () => findPropertySitePaths(),
    ...options,
  });

export const findPropertyNavigationQueryOptions = (
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof findPropertyNavigation>>>,
    "queryKey" | "queryFn"
  >,
) =>
  queryOptions({
    queryKey: propertyKeys.navigations(),
    queryFn: () => findPropertyNavigation(),
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
  >,
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
  >,
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
  >,
) =>
  mutationOptions({
    mutationFn: (id: number) => removeProperty(id),
    ...options,
  });
