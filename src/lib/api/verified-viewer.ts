"use server";

import { verifyAgentSession } from "./agents";
import { getAccessToken } from "./token";
import { extractVerifiedViewer } from "./viewer-session";

export async function getVerifiedViewer() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  const response = await verifyAgentSession(accessToken);
  if (response.data?.status !== "OK") {
    return null;
  }

  return extractVerifiedViewer(response.data.session.userDataInJWT);
}
