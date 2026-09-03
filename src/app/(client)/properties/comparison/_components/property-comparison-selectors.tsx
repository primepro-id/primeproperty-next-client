"use client";

import { TableHead } from "@/components/ui/table";
import {
  findPropertyJoinAgentQueryOptions,
  getBookmarkedPropertyOptions,
} from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PropertyComparisonSelect } from "./property-comparison-select";

type PropertyComparisonSelectorsProps = {
  ids: readonly [number, number];
};

export const PropertyComparisonSelectors = ({
  ids,
}: PropertyComparisonSelectorsProps) => {
  const router = useRouter();
  const bookmarks = useQuery({
    ...getBookmarkedPropertyOptions(),
    enabled: typeof window !== "undefined",
  });
  const bookmarkedProperties = useQuery(
    findPropertyJoinAgentQueryOptions(
      { ids: bookmarks.data?.join(",") },
      { enabled: Boolean(bookmarks.data?.length) },
    ),
  );
  const properties = bookmarkedProperties.data?.data?.data;

  const replaceProperty = (index: number, value: string) => {
    const nextIds = [...ids];
    nextIds.splice(index, 1, Number(value));
    router.replace(`/properties/comparison?ids=${nextIds.join(",")}`);
  };

  return (
    <>
      <TableHead>
        <PropertyComparisonSelect
          onValueChange={(value) => replaceProperty(0, value)}
          selectedId={String(ids[0])}
          properties={properties}
        />
      </TableHead>
      <TableHead>
        <PropertyComparisonSelect
          onValueChange={(value) => replaceProperty(1, value)}
          selectedId={String(ids[1])}
          properties={properties}
        />
      </TableHead>
    </>
  );
};
