import { FindPropertyQuery } from "@/lib/api";
import { Metadata } from "next";
import { generatePropertiesMetadata } from "./_lib/create-properties-metadata";
import { Suspense } from "react";
import Loading from "@/app/(client)/loading";
import { PropertiesPageContent } from "./_components/properties-page-content";

export const revalidate = 0;

type PropertiesPageProps = {
  searchParams: Promise<FindPropertyQuery>;
};

export const generateMetadata = async ({
  searchParams,
}: PropertiesPageProps): Promise<Metadata> =>
  generatePropertiesMetadata(searchParams);

const PropertiesPage = ({ searchParams }: PropertiesPageProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <PropertiesPageContent searchParams={searchParams} />
    </Suspense>
  );
};

export default PropertiesPage;
