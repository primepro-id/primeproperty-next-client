"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FindPropertyQuery } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import qs from "qs";

type PaginationProps = {
  searchParams: FindPropertyQuery;
  currentPage: number;
  totalPages: number;
};

export const Pagination = ({
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) => {
  const router = useRouter();
  const typingTimeoutRef = useRef<any>(null);
  const onTypeChange = (pageNumber: number) => {
    let newPageNumber = pageNumber;
    if (pageNumber < 1) newPageNumber = 1;
    if (pageNumber > totalPages) newPageNumber = totalPages;
    const newParams = qs.stringify({ ...searchParams, page: newPageNumber });
    router.replace(`/properties?${newParams}`);
  };
  const previousPageLink = useMemo(() => {
    const newParams = qs.stringify({ ...searchParams, page: currentPage - 1 });
    return `/properties?${newParams}`;
  }, [currentPage, searchParams]);

  const nextPageLink = useMemo(() => {
    const newParams = qs.stringify({ ...searchParams, page: currentPage + 1 });
    return `/properties?${newParams}`;
  }, [currentPage, searchParams]);

  if (totalPages === 1) return <></>;
  return (
    <div className="flex items-center justify-between w-full md:w-fit md:ml-auto md:gap-4">
      {currentPage === 1 ? (
        <Button
          size="icon"
          variant="outline"
          disabled={currentPage === 1}
          className="rounded-full"
        >
          <LuChevronLeft />
        </Button>
      ) : (
        <Link
          rel="prev"
          href={previousPageLink}
          title="Previous"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "rounded-full",
          )}
        >
          <LuChevronLeft />
        </Link>
      )}
      <div className="text-sm flex items-center gap-2">
        <span>Halaman</span>
        <Input
          type="text"
          ref={typingTimeoutRef}
          min={1}
          max={totalPages}
          className="h-8 w-10"
          placeholder={searchParams.page ? String(searchParams.page) : "1"}
          onChange={(e) => {
            if (isNaN(+e.target.value)) {
              return;
            }
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef?.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              onTypeChange(+e.target.value);
            }, 500);
          }}
        />
        <span>dari</span>
        <span>{totalPages}</span>
      </div>
      {currentPage === totalPages ? (
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          disabled={currentPage === totalPages}
        >
          <LuChevronRight />
        </Button>
      ) : (
        <Link
          href={nextPageLink}
          title="Next"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "rounded-full",
          )}
          rel="next"
        >
          <LuChevronRight />
        </Link>
      )}
    </div>
  );
};
