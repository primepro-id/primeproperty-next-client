"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LuListFilter, LuX } from "react-icons/lu";
import { FilterForm } from "./form";
import { FindPropertyQuery } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { findPropertyNavigationQueryOptions } from "@/lib/hooks";

type FilterDialogProps = {
  searchParams: FindPropertyQuery;
};

export const FilterDialog = ({ searchParams }: FilterDialogProps) => {
  const { data } = useQuery(findPropertyNavigationQueryOptions());
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "relative font-sans",
        )}
      >
        <LuListFilter />
        Filter
        {Object.values(searchParams).filter((val) => val).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-foreground text-background rounded-full h-4 w-4 text-xs font-semibold">
            {Object.values(searchParams).filter((val) => val).length}
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4 z-40 max-w-2xl">
        <div className="flex items-center justify-between">
          <DialogTitle className="font-semibold">
            Filter dan cari properti
          </DialogTitle>
          <DialogDescription />
          <DialogClose>
            <LuX />
          </DialogClose>
        </div>
        <FilterForm
          searchParams={searchParams}
          propertyNavigations={data?.data}
        />
      </DialogContent>
    </Dialog>
  );
};
