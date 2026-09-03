import { PropertyCard } from "./card";
import { LuHouse, LuSearch } from "react-icons/lu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { FilterDialog } from "./fillters";
import { FindPropertyQuery } from "@/lib/api";
import type { PropertyJoinAgent } from "@/lib/types";

type PropertyListProps = {
  searchParams: FindPropertyQuery;
  propertiesWithAgent: PropertyJoinAgent[] | null;
};

export const PropertyList = ({
  searchParams,
  propertiesWithAgent,
}: PropertyListProps) => {
  if (!propertiesWithAgent || propertiesWithAgent?.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center min-h-screen">
        <LuSearch className="text-5xl mb-2" />
        <p className="text-2xl font-bold mb-4">Pencarian tidak ditemukan</p>
        <div className="flex items-center gap-2">
          <Link
            href="/properties"
            className={cn(buttonVariants({ variant: "default" }))}
            aria-label="Lihat Semua Properti"
            title="Lihat Semua Properti"
          >
            <LuHouse />
            Lihat Semua
          </Link>
          <FilterDialog searchParams={searchParams} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-8 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]  w-full min-h-screen",
        propertiesWithAgent.length <= 3 && "lg:grid-cols-3",
      )}
    >
      {propertiesWithAgent.map((propertyWithAgent) => (
        <PropertyCard
          key={propertyWithAgent[0].id}
          propertyWithAgent={propertyWithAgent}
        />
      ))}
    </div>
  );
};
