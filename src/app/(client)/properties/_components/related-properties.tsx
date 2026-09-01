"use client";
import { PropertyCard } from "./card";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import {
  findPropertyJoinAgentQueryOptions,
  getBookmarkedPropertyOptions,
} from "@/lib/hooks";

type RelatedPropertiesProps = {
  propertyId: number;
};

export const RelatedProperties = ({ propertyId }: RelatedPropertiesProps) => {
  const bookmarkedProperties = useQuery(getBookmarkedPropertyOptions());
  const relatedProperties = useQuery(
    findPropertyJoinAgentQueryOptions({ id: propertyId, is_related: true }),
  );
  const propertyData = relatedProperties.data?.data?.data;
  if (propertyData && propertyData.length > 0) {
    return (
      <Carousel>
          <div className="flex items-center justify-between mb-4">
            <h3>PROPERTI TERKAIT</h3>
            <div className="flex items-center gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>
          <CarouselContent>
            {propertyData.map((propertyWithAgent, index) => (
              <CarouselItem
                key={`${index}_related_properties`}
                className="basis-4/5 md:basis-1/2 lg:basis-1/3"
              >
                <PropertyCard
                  propertyWithAgent={propertyWithAgent}
                  bookmarkedProperties={bookmarkedProperties.data}
                  onBookmarkClickAction={() => bookmarkedProperties.refetch()}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
      </Carousel>
    );
  }

  return <></>;
};
