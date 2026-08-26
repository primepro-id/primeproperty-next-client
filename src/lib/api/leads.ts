import { DataAndPagination, JsonResponse, Lead } from "../types";
import { fetchJsonApi } from "./fetch-api";
import { getAccessToken } from "./token";
import qs from "qs";

/**
 * Public endpoint to create a new lead.
 * POST /leads
 */

export type CreateLeadPayload = {
  property_id: number;
  name: string;
  phone: string;
  email?: string | null;
};

export type FindLeadQuery = {
  agent_id?: string;
};

export async function createLead(
  payload: CreateLeadPayload,
): Promise<JsonResponse<Lead>> {
  return fetchJsonApi("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Authenticated endpoint to retrieve leads for the session agent.
 * GET /leads
 */
export async function getLeads(
  query: FindLeadQuery = {},
): Promise<JsonResponse<DataAndPagination<Lead[]>>> {
  const searchParams = qs.stringify(query, {
    addQueryPrefix: true,
    filter: (prefix, value) => value || undefined,
  });

  return fetchJsonApi(`/leads${searchParams}`, {
    method: "GET",
    headers: {
      "x-access-token": await getAccessToken(),
    },
  });
}
