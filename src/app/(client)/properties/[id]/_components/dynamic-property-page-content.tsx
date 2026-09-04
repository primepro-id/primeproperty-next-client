import { findUniquePropertyJoinAgent } from "@/lib/api";
import { DynamicProperty } from "./dynamic-property";
import { PropertiesFilter } from "../../_components/fillters/properties-filter";
import { PropertyNotFound } from "../../_components/not-found";
import { parsePropertyDetailId } from "../../_lib/parse-property-route-ids";

type DynamicPropertyPageContentProps = {
  params: Promise<{ id: string }>;
};

export const DynamicPropertyPageContent = async ({
  params,
}: DynamicPropertyPageContentProps) => {
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
