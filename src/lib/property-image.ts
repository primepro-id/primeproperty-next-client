import { env } from "@/lib/env";

export const getPropertyImageSrc = (path?: string | null): string => {
  if (!path?.trim().replaceAll("/", "")) {
    return "/images/property-placeholder.svg";
  }
  return env.NEXT_PUBLIC_S3_ENDPOINT + path;
};
