import {
  queryOptions,
  mutationOptions,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { Agent, DataAndPagination, JsonResponse, Supertokens } from "../types";
import {
  getAgents,
  getAgentById,
  getAgentByFullname,
  signinAgent,
  createAgentPasswordResetToken,
  resetAgentPassword,
  refreshAgentSession,
  updateAgent,
  createAgent,
  deleteAgent,
  PasswordResetPayload,
} from "../api"; // adjust import path as needed

// ==========================================
// Query Keys
// ==========================================
export const agentKeys = {
  all: ["agents"] as const,
  lists: () => [...agentKeys.all, "list"] as const,
  details: () => [...agentKeys.all, "detail"] as const,
  detailById: (id: string) => [...agentKeys.details(), "id", id] as const,
  detailByFullname: (fullname: string) =>
    [...agentKeys.details(), "fullname", fullname] as const,
};

// ==========================================
// Query Options
// ==========================================
export function getAgentsQueryOptions<
  TData = JsonResponse<DataAndPagination<Agent[]>>,
>(
  options?: Omit<
    UseQueryOptions<JsonResponse<DataAndPagination<Agent[]>>, Error, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: agentKeys.lists(),
    queryFn: () => getAgents(),
    ...options,
  });
}

export function getAgentByIdQueryOptions<TData = JsonResponse<Agent>>(
  id: string,
  options?: Omit<
    UseQueryOptions<JsonResponse<Agent>, Error, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: agentKeys.detailById(id),
    queryFn: () => getAgentById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options,
  });
}

export function getAgentByFullnameQueryOptions<TData = JsonResponse<Agent>>(
  fullname: string,
  options?: Omit<
    UseQueryOptions<JsonResponse<Agent>, Error, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: agentKeys.detailByFullname(fullname),
    queryFn: () => getAgentByFullname(fullname),
    enabled: Boolean(fullname) && (options?.enabled ?? true),
    ...options,
  });
}

// ==========================================
// Mutation Options
// ==========================================
export function signinAgentMutationOptions(
  options?: Omit<
    UseMutationOptions<
      JsonResponse<Supertokens.CreateSessionResponse>,
      Error,
      Parameters<typeof signinAgent>[0]
    >,
    "mutationFn"
  >,
) {
  return mutationOptions({
    mutationFn: (credentials) => signinAgent(credentials),
    ...options,
  });
}

export function createAgentPasswordResetTokenMutationOptions(
  options?: Omit<
    UseMutationOptions<JsonResponse<string>, Error, string>,
    "mutationFn"
  >,
) {
  return mutationOptions({
    mutationFn: (email) => createAgentPasswordResetToken(email),
    ...options,
  });
}

export function resetAgentPasswordMutationOptions(
  options?: Omit<
    UseMutationOptions<
      JsonResponse<Supertokens.UpdateUserResponse>,
      Error,
      PasswordResetPayload
    >,
    "mutationFn"
  >,
) {
  return mutationOptions({
    mutationFn: (payload) => resetAgentPassword(payload),
    ...options,
  });
}

export function refreshAgentSessionMutationOptions(
  options?: Omit<
    UseMutationOptions<
      JsonResponse<Supertokens.CreateSessionResponse>,
      Error,
      string
    >,
    "mutationFn"
  >,
) {
  return mutationOptions({
    mutationFn: (refreshToken) => refreshAgentSession(refreshToken),
    ...options,
  });
}

export function updateAgentMutationOptions(
  options?: Omit<
    UseMutationOptions<
      JsonResponse<Agent>,
      Error,
      { id: string; updateData: Parameters<typeof updateAgent>[1] }
    >,
    "mutationFn"
  >,
) {
  return mutationOptions({
    mutationFn: ({ id, updateData }) => updateAgent(id, updateData),
    ...options,
  });
}

export function createAgentMutationOptions(
  options?: Omit<
    UseMutationOptions<
      JsonResponse<Agent>,
      Error,
      Parameters<typeof createAgent>[0]
    >,
    "mutationFn"
  >,
) {
  return mutationOptions({
    mutationFn: (agentData) => createAgent(agentData),
    ...options,
  });
}

export function deleteAgentMutationOptions(
  options?: Omit<
    UseMutationOptions<JsonResponse<Agent>, Error, string>,
    "mutationFn"
  >,
) {
  return mutationOptions({
    mutationFn: (id) => deleteAgent(id),
    ...options,
  });
}
