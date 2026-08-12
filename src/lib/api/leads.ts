import { DataAndPagination, JsonResponse, Lead } from "../types";
import { fetchJsonApi } from "./fetch-api";
import { getAccessToken } from "./token";

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
export async function getLeads(): Promise<JsonResponse<DataAndPagination<Lead[]>>> {
  return fetchJsonApi("/leads", {
    method: "GET",
    headers: {
      "x-access-token": await getAccessToken(),
    },
  });
}
