import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { PropertiesTable } from "./_components/properties-table";
import {
  normalizePropertiesSearchParams,
  type PropertiesSearchParams,
} from "./_lib/normalize-properties-search-params";

type PropertiesPageProps = {
  searchParams: Promise<PropertiesSearchParams>;
};

export default async function Page({ searchParams }: PropertiesPageProps) {
  const query = normalizePropertiesSearchParams(await searchParams);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-bold">PROPERTIES</h1>
        <Button asChild variant="outline">
          <Link href="/admin/properties/new">
            <LuPlus data-icon="inline-start" />
            New Properties
          </Link>
        </Button>
      </div>

      <PropertiesTable query={query} />
    </div>
  );
}
