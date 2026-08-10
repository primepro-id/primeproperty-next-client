import { DataAndPagination, Developer, JsonResponse } from "../types";
import { fetchJsonApi } from "./fetch-api";
import { getAccessToken } from "./token";
/**
 * GET /developers
 * Fetches all developers along with pagination metadata.
 */
export async function getDevelopers(): Promise<DataAndPagination<Developer[]>> {
  return fetchJsonApi('/developers', {
    method: 'GET',
  });
}

/**
 * GET /developers/{id}
 * Fetches a single developer by ID.
 */
export async function getDeveloperById(id: string | number): Promise<JsonResponse<Developer>> {
  return fetchJsonApi(`/developers/${id}`, {
    method: 'GET',
  });
}

/**
 * POST /developers
 * Creates a new developer (Admin endpoint).
 */

 type CreateDeveloperPayload = {
   name: string;
   logo_path: string;
 }

export async function createDeveloper(
  payload: CreateDeveloperPayload,
): Promise<JsonResponse<Developer>> {
  return fetchJsonApi('/developers', {
    method: 'POST',
    headers: {
      "x-access-token": await getAccessToken()
    },
    body: JSON.stringify(payload),
  });
}

/**
 * PUT /developers/{id}
 * Updates an existing developer by ID (Admin endpoint).
 */

 type UpdateDeveloperPayload = {
   name: string;
   logo_path: string;
 }


export async function updateDeveloper(
  id: string | number,
  payload: UpdateDeveloperPayload,
): Promise<JsonResponse<Developer>> {
  return fetchJsonApi(`/developers/${id}`, {
    headers: {
      "x-access-token": await getAccessToken()
    },
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * DELETE /developers/{id}
 * Removes a developer by ID (Admin endpoint).
 */
export async function deleteDeveloper(
  id: string | number,
): Promise<JsonResponse<Developer>> {
  return fetchJsonApi(`/developers/${id}`, {
    headers: {
      "x-access-token": await getAccessToken()
    },
    method: 'DELETE',
  });
}
