import { Suspense } from "react";
import { Metadata } from "next";
import { generatePropertiesFilterMetadata } from "../../_lib/create-properties-filter-metadata";
import Loading from "@/app/(client)/loading";
import { PropertiesFilterPageContent } from "./_components/properties-filter-page-content";

type PageProps = {
  params: Promise<{ params: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps): Promise<Metadata> =>
  generatePropertiesFilterMetadata(params, searchParams);

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <PropertiesFilterPageContent params={params} />
    </Suspense>
  );
}
