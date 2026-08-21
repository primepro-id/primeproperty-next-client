import { Agent, DataAndPagination, JsonResponse, Supertokens } from "../types";
import { fetchJsonApi } from "./fetch-api";
import { getAccessToken } from "./token";

export async function getAgents(): Promise<
  JsonResponse<DataAndPagination<Agent[]>>
> {
  return fetchJsonApi("/agents");
}

export async function getAgentById(id: string): Promise<JsonResponse<Agent>> {
  return fetchJsonApi(`/agents/${id}`);
}

export async function getAgentByFullname(
  fullname: string,
): Promise<JsonResponse<Agent>> {
  return fetchJsonApi(`/agents/fullname/${encodeURIComponent(fullname)}`);
}

type SigninPayload = {
  email: string;
  password: string;
};

export async function signinAgent(
  credentials: SigninPayload,
): Promise<JsonResponse<Supertokens.CreateSessionResponse>> {
  return fetchJsonApi("/agents/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

type PasswordResetTokenPayload = {
  email: string;
};

export async function createAgentPasswordResetToken(
  email: string,
): Promise<JsonResponse<string>> {
  const payload: PasswordResetTokenPayload = { email };
  return fetchJsonApi("/agents/password-reset-token", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type PasswordResetPayload = {
  token: string;
  password: string;
};

export async function resetAgentPassword(
  payload: PasswordResetPayload,
): Promise<JsonResponse<Supertokens.UpdateUserResponse>> {
  return fetchJsonApi("/agents/password-reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

type RefreshSessionPayload = {
  refresh_token: string;
};

export async function refreshAgentSession(
  refreshToken: string,
): Promise<JsonResponse<Supertokens.CreateSessionResponse>> {
  const payload: RefreshSessionPayload = { refresh_token: refreshToken };
  return fetchJsonApi("/agents/session/refresh", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// Protected Routes (Session Required)
// ==========================================

type UpdateAgentPayload = {
  profile_picture_url?: string;
  fullname?: string;
  phone_number?: string;
  instagram?: string;
  description?: string;
};

export async function updateAgent(
  id: string,
  updateData: UpdateAgentPayload,
): Promise<JsonResponse<Agent>> {
  return fetchJsonApi(`/agents/${id}`, {
    method: "PUT",
    headers: {
      "x-access-token": await getAccessToken(),
    },
    body: JSON.stringify(updateData),
  });
}

// ==========================================
// Admin Routes (Admin Role Required)
// ==========================================

type CreateAgentPayload = {
  profile_picture_url: string;
  fullname: string;
  email: string;
  phone_number: string;
  instagram?: string;
};

export async function createAgent(
  agentData: CreateAgentPayload,
): Promise<JsonResponse<Agent>> {
  return fetchJsonApi("/agents", {
    method: "POST",
    headers: {
      "x-access-token": await getAccessToken(),
    },
    body: JSON.stringify(agentData),
  });
}

export async function deleteAgent(id: string): Promise<JsonResponse<Agent>> {
  return fetchJsonApi(`/agents/${id}`, {
    method: "DELETE",
    headers: {
      "x-access-token": await getAccessToken(),
    },
  });
}
