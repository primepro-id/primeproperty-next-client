import { DynamicProperty } from "./_components";
import { PropertiesFilter } from "../_components";
import { Metadata } from "next";
import { generateDynamicPropertyMetadata } from "./_lib/generate-dynamic-property-metadata";

type DynamicPropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: DynamicPropertyPageProps): Promise<Metadata | undefined> =>
  generateDynamicPropertyMetadata(params);

const DynamicPropertyPage = async ({ params }: DynamicPropertyPageProps) => {
  const { id } = await params;
  const [propertyId] = id.split("-");
  return (
    <>
      <PropertiesFilter searchParams={{}} />
      <DynamicProperty propertyId={Number(propertyId)} />
    </>
  );
};

export default DynamicPropertyPage;
