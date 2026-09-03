import { PropertyCard } from "./card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { findPropertyJoinAgent } from "@/lib/api";
import type { PropertyJoinAgent } from "@/lib/types";

type PopularPropertiesProps = {
  properties?: PropertyJoinAgent[];
};

export const PopularProperties = async ({
  properties,
}: PopularPropertiesProps = {}) => {
  const propertyData =
    properties ??
    (await findPropertyJoinAgent({ is_popular: true })).data?.data;
  if (propertyData && propertyData.length > 0) {
    return (
      <Carousel>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">Properti Populer</h3>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>
        <CarouselContent>
          {propertyData.map((propertyWithAgent, index) => (
            <CarouselItem
              key={`${index}_popular_properties`}
              className="basis-4/5 md:basis-1/2 lg:basis-1/3"
            >
              <PropertyCard propertyWithAgent={propertyWithAgent} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  }

  return <></>;
};
