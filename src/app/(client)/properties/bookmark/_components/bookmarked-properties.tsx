"use client";
import { useQuery } from "@tanstack/react-query";
import { EmptyBookmarkedProperties } from "./empty-bookmarked-properties";
import Loading from "@/app/(client)/loading";
import { BookmarkedPropertyTable } from "./bookmarked-property-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { findPropertyJoinAgentQueryOptions, getBookmarkedPropertyOptions } from "@/lib/hooks";

export const BookmarkedProperties = () => {
  const router = useRouter();
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const bookmarkedProperties = useQuery(getBookmarkedPropertyOptions());
  const properties = useQuery(findPropertyJoinAgentQueryOptions({ ids: bookmarkedProperties.data?.join(",") }, {

    enabled:      !!bookmarkedProperties.data && bookmarkedProperties?.data?.length > 0,
  }))

  if (bookmarkedProperties.isLoading || properties.isLoading) {
    return <Loading />;
  }

  if (bookmarkedProperties.data?.length === 0 || !properties?.data?.data) {
    return <EmptyBookmarkedProperties />;
  }

  return (
    <div>
      <BookmarkedPropertyTable
        onBookmarkClickAction={() => bookmarkedProperties.refetch()}
        bookmarkedProperties={bookmarkedProperties?.data}
        properties={properties?.data?.data?.data}
        selectedProperties={selectedProperties}
        setSelectedProperties={setSelectedProperties}
      />

      <div className="fixed left-0 bottom-0 shadow border-t border-t-primary bg-background w-full p-4 flex items-center justify-end gap-4">
        <span className="text-right">
          <p className="font-bold">
            {selectedProperties.length} Properti dipilih
          </p>
          <p className="text-muted-foreground text-sm">
            Pilih 2 properti untuk perbandingan
          </p>
        </span>
        <Button
          disabled={selectedProperties.length !== 2}
          onClick={() =>
            router.push(
              `/properties/comparison?ids=${selectedProperties.join(",")}`,
            )
          }
        >
          LANJUTKAN
        </Button>
      </div>
    </div>
  );
};
