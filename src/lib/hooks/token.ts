import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { getAccessToken } from "../api";

export const tokenKeys = {
  accessToken: ["accessToken"] as const,
};

export function accessTokenQueryOptions<TData = string>(
  options?: Omit<UseQueryOptions<string, Error, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: tokenKeys.accessToken,
    queryFn: getAccessToken,
    ...options,
  });
}
