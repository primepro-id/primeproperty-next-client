import Image from "next/image";
import { PropertiesFilter } from "./fillters";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { FindPropertyQuery } from "@/lib/api";
import { LuHouse } from "react-icons/lu";
import { PropertiesTitle } from "./title";

type PropertyNotFoundProps = {
  searchParams: FindPropertyQuery;
};

export const PropertyNotFound = ({ searchParams }: PropertyNotFoundProps) => {
  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center h-96 gap-4">
      <Image src="/images/primepro.png" alt="Primepro" width={75} height={75} />
      <PropertiesTitle
        searchParams={searchParams}
        propertyCount={0}
        className="justify-center"
      />

      <PropertiesFilter searchParams={{}} />

      <span className="text-muted-foreground">atau</span>

      <Link
        href="/properties"
        className={cn(buttonVariants({ variant: "default" }))}
        aria-label="Lihat Semua Properti"
        title="Lihat Semua Properti"
      >
        <LuHouse />
        Lihat Semua
      </Link>
    </div>
  );
};
