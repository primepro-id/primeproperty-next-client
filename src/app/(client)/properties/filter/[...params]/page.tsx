import { Suspense } from "react";
import { Properties } from "../../_components";
import { parseFilterParams } from "../../_lib/parse-filter-params";
import { Metadata } from "next";
import { generatePropertiesFilterMetadata } from "../../_lib/create-properties-filter-metadata";

type PageProps = {
  params: Promise<{ params: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps): Promise<Metadata> =>
  generatePropertiesFilterMetadata(params, searchParams);

export default async function Page({ params }: PageProps) {
  const pageParams = await params;

  return (
    <Suspense>
      <Properties
        searchParams={parseFilterParams(pageParams.params)}
        path={`/properties/filter/${pageParams.params.join("/")}`}
      />
    </Suspense>
  );
}
