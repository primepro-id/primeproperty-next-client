import { PropertyJoinAgent } from "@/lib/types";
import { env } from "@/lib/env";
import Link from "next/link";
import { Specifications } from "./specifications";
import { WatermarkImage } from "@/components/custom-ui/watermark-image";
import { PropertyPriceTag } from "./property-price-tag";
import { PropertyAgentInfo } from "./property-agent-info";
import { createPropertyPath } from "@/lib/metadata/seo-domain";
import { PropertyBookmarkButton } from "./property-bookmark-button";
import { PropertyComparisonActions } from "./property-comparison-actions";

type PropertyCardProps = {
  propertyWithAgent: PropertyJoinAgent;
  onBookmarkClickAction?: () => void;
  isComparison?: boolean;
  onCompareClick?: () => void;
  isComparisonActive?: boolean;
  isComparisonDisabled?: boolean;
};

const PropertyContent = ({
  propertyWithAgent,
}: Pick<PropertyCardProps, "propertyWithAgent">) => {
  return (
    <div className="flex flex-col">
      <PropertyPriceTag propertyWithAgent={propertyWithAgent} />
      <p className=" text-lg group-hover:underline line-clamp-2 font-sans">
        {propertyWithAgent[0].title}
      </p>
      <p className="text-muted-foreground group-hover:underline capitalize flex gap-1">
        {propertyWithAgent[0].street}, {propertyWithAgent[0].regency}
      </p>
      <p className="text-sm line-clamp-2 my-2 text-muted-foreground">
        {propertyWithAgent[0].description}
      </p>
      <Specifications propertyWithAgent={propertyWithAgent} />
    </div>
  );
};

export const PropertyCard = ({
  propertyWithAgent,
  onBookmarkClickAction,
  isComparison,
  isComparisonActive,
  onCompareClick,
  isComparisonDisabled,
}: PropertyCardProps) => {
  const baseImgPath = env.NEXT_PUBLIC_S3_ENDPOINT;
  const coverImage =
    propertyWithAgent[0].images.find((img) => img.is_cover) ??
    propertyWithAgent[0].images[0];

  return (
    <div className="flex flex-col gap-2">
      <Link
        title={propertyWithAgent[0].title}
        aria-label={propertyWithAgent[0].title}
        href={createPropertyPath(propertyWithAgent[0])}
        className="relative group flex flex-col gap-2"
      >
        <div className="bg-primary text-primary-foreground px-2 py-1 text-xs rounded absolute top-1 left-1 dark:font-semibold uppercase z-[5]">
          {propertyWithAgent[0].building_type}
        </div>
        <WatermarkImage
          watermarkProps={{
            fontSize: 20,
          }}
          imageProps={{
            src: baseImgPath + coverImage.path,
            alt: propertyWithAgent[0].title,
            width: 1024,
            height: 768,
            className: "w-full h-64 object-cover rounded-lg aspect-square",
          }}
        />

        {propertyWithAgent[0].configurations.is_njop_price && (
          <div className="bg-secondary text-primary-foreground px-2 py-1 text-xs rounded capitalize absolute top-[54%] right-1 font-semibold">
            HARGA NJOP
          </div>
        )}
        <PropertyBookmarkButton
          propertyId={propertyWithAgent[0].id}
          onBookmarkChange={onBookmarkClickAction}
        />
        <PropertyContent propertyWithAgent={propertyWithAgent} />
      </Link>
      {isComparison ? (
        <PropertyComparisonActions
          propertyWithAgent={propertyWithAgent}
          isComparisonActive={isComparisonActive}
          onCompareClick={onCompareClick}
          isComparisonDisabled={isComparisonDisabled}
        />
      ) : (
        <PropertyAgentInfo propertyWithAgent={propertyWithAgent} />
      )}
    </div>
  );
};
