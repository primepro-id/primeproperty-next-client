"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FindPropertyQuery } from "@/lib/api";
import { useEffect } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { PropertySearchParamsUpdater } from "../_lib/update-property-search-params";

type PropertiesPaginationProps = {
  query: FindPropertyQuery;
  totalPages: number;
  updateSearchParams: PropertySearchParamsUpdater;
};

const PAGE_LIMITS = [10, 25, 50];

export function PropertiesPagination({
  query,
  totalPages,
  updateSearchParams,
}: PropertiesPaginationProps) {
  const requestedPage = query.page ?? 1;
  const normalizedTotalPages = Math.max(totalPages, 1);
  const currentPage = Math.min(requestedPage, normalizedTotalPages);

  useEffect(() => {
    if (totalPages === 0) {
      if (requestedPage > 1) {
        updateSearchParams({ page: undefined }, false);
      }
      return;
    }

    if (requestedPage <= totalPages) {
      return;
    }

    updateSearchParams({ page: totalPages }, false);
  }, [requestedPage, totalPages, updateSearchParams]);

  const changePage = (page: number) => updateSearchParams({ page }, false);

  const changeLimit = (limit: string) => updateSearchParams({ limit }, true);

  return (
    <div className="flex flex-wrap items-center justify-end gap-4">
      <Field orientation="horizontal" className="w-auto">
        <FieldLabel htmlFor="property-page-limit">Rows per page</FieldLabel>
        <Select value={String(query.limit ?? 10)} onValueChange={changeLimit}>
          <SelectTrigger id="property-page-limit" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PAGE_LIMITS.map((limit) => (
                <SelectItem key={limit} value={String(limit)}>
                  {limit}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {normalizedTotalPages}
      </span>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => changePage(currentPage - 1)}
        >
          <LuChevronLeft data-icon="inline-start" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Next page"
          disabled={currentPage >= normalizedTotalPages}
          onClick={() => changePage(currentPage + 1)}
        >
          <LuChevronRight data-icon="inline-start" />
        </Button>
      </div>
    </div>
  );
}
