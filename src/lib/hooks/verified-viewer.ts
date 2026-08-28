import { getVerifiedViewer } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export const verifiedViewerKeys = {
  viewer: ["verified-viewer"] as const,
};

export function verifiedViewerQueryOptions() {
  return queryOptions({
    queryKey: verifiedViewerKeys.viewer,
    queryFn: getVerifiedViewer,
  });
}
