import { Metadata } from "next";
import { generateDynamicPropertyMetadata } from "./_lib/generate-dynamic-property-metadata";
import { Suspense } from "react";
import Loading from "@/app/(client)/loading";
import { DynamicPropertyPageContent } from "./_components/dynamic-property-page-content";

export const revalidate = 0;
type DynamicPropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: DynamicPropertyPageProps): Promise<Metadata | undefined> =>
  generateDynamicPropertyMetadata(params);

const DynamicPropertyPage = ({ params }: DynamicPropertyPageProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <DynamicPropertyPageContent params={params} />
    </Suspense>
  );
};

export default DynamicPropertyPage;
