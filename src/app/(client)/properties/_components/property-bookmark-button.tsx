"use client";

import { Button } from "@/components/ui/button";
import { getBookmarkedPropertyOptions } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { LuBookmark, LuBookmarkCheck } from "react-icons/lu";
import { bookmarkProperty } from "../_lib/bookmark-property";

type PropertyBookmarkButtonProps = {
  propertyId: number;
  onBookmarkChange?: () => void;
};

export const PropertyBookmarkButton = ({
  propertyId,
  onBookmarkChange,
}: PropertyBookmarkButtonProps) => {
  const bookmarkedProperties = useQuery({
    ...getBookmarkedPropertyOptions(),
    enabled: typeof window !== "undefined",
  });

  return (
    <Button
      size="icon"
      variant="outline"
      className="absolute right-1 top-1"
      onClick={(event) => {
        event.preventDefault();
        bookmarkProperty(propertyId);
        void bookmarkedProperties.refetch();
        onBookmarkChange?.();
      }}
    >
      {bookmarkedProperties.data?.includes(propertyId) ? (
        <LuBookmarkCheck />
      ) : (
        <LuBookmark />
      )}
    </Button>
  );
};
