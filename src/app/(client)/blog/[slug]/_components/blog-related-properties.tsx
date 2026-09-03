import { PropertyCard } from "@/app/(client)/properties/_components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { findPropertyJoinAgent, type FindPropertyQuery } from "@/lib/api";

type RelatedPropertiesProps = {
  relatedProperties: string;
};

export const BlogRelatedProperties = async ({
  relatedProperties,
}: RelatedPropertiesProps) => {
  let relatedParams: FindPropertyQuery = {
    street: relatedProperties,
    limit: 10,
  };
  if (relatedProperties.includes("jakarta")) {
    relatedParams = { regency: relatedProperties };
  } else if (relatedProperties === "terbaru") {
    relatedParams = {};
  }

  const properties = await findPropertyJoinAgent(relatedParams);
  const propertyData = properties.data?.data;
  if (propertyData && propertyData.length > 0) {
    return (
      <Carousel>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">Properti Terkait</h3>
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
