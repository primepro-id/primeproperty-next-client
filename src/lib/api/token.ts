'use server'
import { cookies } from "next/headers"

export const getAccessToken = async () => {
  const cooks = await cookies();
  const accessToken = cooks.get("accessToken")
  return accessToken?.value ? accessToken?.value : ""
}
