"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBookmarkedPropertyOptions } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { LuBookmark, LuBookmarkCheck } from "react-icons/lu";
import { bookmarkProperty } from "../_lib/bookmark-property";

type PropertyBookmarkButtonProps = {
  propertyId: number;
  onBookmarkChange?: () => void;
  className?: string;
};

export const PropertyBookmarkButton = ({
  propertyId,
  onBookmarkChange,
  className,
}: PropertyBookmarkButtonProps) => {
  const bookmarkedProperties = useQuery({
    ...getBookmarkedPropertyOptions(),
    enabled: typeof window !== "undefined",
  });

  return (
    <Button
      size="icon"
      variant="outline"
      className={cn("absolute right-1 top-1", className)}
      aria-label="Simpan properti"
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
