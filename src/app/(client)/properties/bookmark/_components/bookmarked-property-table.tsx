import React, { Dispatch, SetStateAction } from "react";
import { PropertyCard } from "../../_components/card";
import { cn } from "@/lib/utils";
import { PropertyJoinAgent } from "@/lib/types";

type BookmarkedPropertyTableProps = {
  properties: PropertyJoinAgent[];
  onBookmarkClickAction: () => void;
  selectedProperties: number[];
  setSelectedProperties: Dispatch<SetStateAction<number[]>>;
};

export const BookmarkedPropertyTable = ({
  properties,
  onBookmarkClickAction,
  selectedProperties,
  setSelectedProperties,
}: BookmarkedPropertyTableProps) => {
  return (
    <div
      className={cn(
        "grid gap-8 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]  w-full",
        properties.length <= 3 && "lg:grid-cols-3",
      )}
    >
      {properties?.map((p) => (
        <React.Fragment key={p[0].id}>
          <PropertyCard
            isComparison
            propertyWithAgent={p}
            onBookmarkClickAction={onBookmarkClickAction}
            isComparisonActive={selectedProperties.includes(p[0].id)}
            isComparisonDisabled={
              selectedProperties.length >= 2 &&
              !selectedProperties.includes(p[0].id)
            }
            onCompareClick={() => {
              if (selectedProperties.includes(p[0].id)) {
                const newSelected = [...selectedProperties];
                newSelected.splice(selectedProperties.indexOf(p[0].id), 1);
                setSelectedProperties(newSelected);
              } else {
                setSelectedProperties([...selectedProperties, p[0].id]);
              }
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};
