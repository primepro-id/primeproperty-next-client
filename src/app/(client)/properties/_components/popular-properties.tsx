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
import { createPropertiesSchema } from "@/lib/schema/create-properties-schema";
import { useQuery } from "@tanstack/react-query";
import {
  findPropertyJoinAgentQueryOptions,
  getBookmarkedPropertyOptions,
} from "@/lib/hooks";

export const PopularProperties = () => {
  const properties = useQuery(
    findPropertyJoinAgentQueryOptions({ is_popular: true }),
  );
  const bookmarkedProperties = useQuery(getBookmarkedPropertyOptions());
  if (properties.data?.data.data && properties.data?.data?.data.length > 0) {
    const jsonLd = createPropertiesSchema(properties?.data.data.data, {});
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Carousel>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">Properti Populer</h3>
            <div className="flex items-center gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>
          <CarouselContent>
            {properties.data.data.data.map((propertyWithAgent, index) => (
              <CarouselItem
                key={`${index}_popular_properties`}
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
      </>
    );
  }

  return <></>;
};
