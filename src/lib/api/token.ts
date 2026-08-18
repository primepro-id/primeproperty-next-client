"use server";
import { cookies } from "next/headers";

export const getAccessToken = async () => {
  const cooks = await cookies();
  const accessToken = cooks.get("accessToken");
  return accessToken?.value ? accessToken?.value : "";
};

export const setAccessToken = async (token: string) => {
  const cooks = await cookies();
  const accessToken = cooks.set("accessToken", token);
  return accessToken.toString();
};

export const setRefreshToken = async (token: string) => {
  const cooks = await cookies();
  const accessToken = cooks.set("refreshToken", token);
  return accessToken.toString();
};
