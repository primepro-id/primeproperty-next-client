"use client";
import { LuSearch } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChangeEvent, useRef, useState } from "react";
import Link from "next/link";
import { useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import { sendGAEvent } from "@next/third-parties/google";
import { useMutation } from "@tanstack/react-query";
import { PropertyJoinAgent, PropertyPurchaseStatus } from "@/lib/types";
import { findPropertyJoinAgent } from "@/lib/api";

type SearchResultProps = {
  isLoading: boolean;
  results: PropertyJoinAgent[];
};

export const SearchResult = ({ isLoading, results }: SearchResultProps) => {
  if (isLoading) {
    return <div className="w-full px-4 py-2 animate-pulse">Loading...</div>;
  }

  return (
    <div className="max-h-48 lg:max-h-80 overflow-y-auto">
      {results.map((result, index) => {
        return (
          <Link
            href={`/properties/filter/${result[0].site_path}`}
            key={`${index}_search`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "justify-start w-full capitalize",
            )}
            onClick={() => sendGAEvent("event", "search_redirect")}
          >
            {result[0].building_type}{" "}
            {result[0].purchase_status === PropertyPurchaseStatus.ForRent
              ? "disewa"
              : "dijual"}{" "}
            {result[0].street} {result[0].regency}
          </Link>
        );
      })}
    </div>
  );
};

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  const typingTimeoutRef = useRef<any>(null);
  const searchMutation = useMutation({
    mutationFn: async (keyword: string) => {
      if (keyword) {
        return await findPropertyJoinAgent({ keyword });
      }
      return null;
    },
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(async () => {
      searchMutation.mutate(e.target.value);
    }, 500);
  };

  return (
    <div
      className="flex items-center w-full relative "
      ref={refs.setReference}
      {...getReferenceProps()}
    >
      <>
        <div
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "border-r-transparent rounded-r-none w-10 h-10",
          )}
        >
          <LuSearch />
        </div>
        <Input
          ref={typingTimeoutRef}
          type="text"
          id="property-search"
          placeholder="Cari tipe bangunan, lokasi, area"
          className="rounded-l-none border-l-transparent focus-visible:ring-transparent focus-visible:ring-offset-transparent w-full pl-0 placeholder:font-sans"
          onChange={onInputChange}
        />
      </>

      {isOpen && (
        <div
          ref={refs.setFloating}
          {...getFloatingProps()}
          className="absolute top-11 left-0 bg-background shadow w-80 md:w-96 rounded z-30 overflow-y-auto"
        >
          <SearchResult
            isLoading={searchMutation.isPending}
            results={searchMutation.data?.data?.data ?? []}
          />
        </div>
      )}
    </div>
  );
};
