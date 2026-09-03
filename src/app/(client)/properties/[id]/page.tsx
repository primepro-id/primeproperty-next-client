import { DynamicProperty } from "./_components";
import { PropertiesFilter } from "../_components";
import { PropertyNotFound } from "../_components/not-found";
import { Metadata } from "next";
import { generateDynamicPropertyMetadata } from "./_lib/generate-dynamic-property-metadata";
import { findUniquePropertyJoinAgent } from "@/lib/api";
import { parsePropertyDetailId } from "../_lib/parse-property-route-ids";

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

const DynamicPropertyPage = async ({ params }: DynamicPropertyPageProps) => {
  const { id } = await params;
  const numericPropertyId = parsePropertyDetailId(id);
  if (numericPropertyId === null) {
    return <PropertyNotFound searchParams={{}} />;
  }
  const propertyResponse = await findUniquePropertyJoinAgent(numericPropertyId);
  return (
    <>
      <PropertiesFilter searchParams={{}} />
      <DynamicProperty
        propertyId={numericPropertyId}
        property={propertyResponse.data}
      />
    </>
  );
};

export default DynamicPropertyPage;
