
import { BOOKMARK_STORAGE_TAG, getBookmarkIds } from "@/app/(client)/properties/_lib/bookmark-property";
import { queryOptions } from "@tanstack/react-query";

export const getBookmarkedPropertyOptions = () => {
  return queryOptions({
    queryKey: [BOOKMARK_STORAGE_TAG],
    queryFn: getBookmarkIds,
  });
};
