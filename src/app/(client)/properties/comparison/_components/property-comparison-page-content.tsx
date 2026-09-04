import { findUniquePropertyJoinAgent } from "@/lib/api";
import { parsePropertyComparisonIds } from "../../_lib/parse-property-route-ids";
import {
  PropertyComparison,
  PropertyComparisonFallback,
} from "./property-comparison";

type PropertyComparisonPageContentProps = {
  searchParams: Promise<{ ids?: string | string[] }>;
};

export const PropertyComparisonPageContent = async ({
  searchParams,
}: PropertyComparisonPageContentProps) => {
  const { ids } = await searchParams;
  const propertyIds = parsePropertyComparisonIds(ids);
  if (!propertyIds) {
    return <PropertyComparisonFallback />;
  }

  const [firstId, secondId] = propertyIds;
  const [firstProperty, secondProperty] = await Promise.all([
    findUniquePropertyJoinAgent(firstId),
    findUniquePropertyJoinAgent(secondId),
  ]);

  return (
    <PropertyComparison
      ids={propertyIds}
      firstProperty={firstProperty.data}
      secondProperty={secondProperty.data}
    />
  );
};
