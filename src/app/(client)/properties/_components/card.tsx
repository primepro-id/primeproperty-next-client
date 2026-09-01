"use client";
import { PropertyJoinAgent } from "@/lib/types";
import { env } from "@/lib/env";
import Link from "next/link";
import { ContactAgentDialog } from "./contact-agent-dialog";
import { Specifications } from "./specifications";
import { WatermarkImage } from "@/components/custom-ui/watermark-image";
import {
  LuBookmark,
  LuBookmarkCheck,
  LuCircle,
  LuCircleCheck,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { bookmarkProperty } from "../_lib/bookmark-property";
import { Tooltip } from "react-tooltip";
import { PropertyPriceTag } from "./property-price-tag";
import { PropertyAgentInfo } from "./property-agent-info";
import { createPropertyPath } from "@/lib/metadata/seo-domain";

type PropertyCardProps = {
  propertyWithAgent: PropertyJoinAgent;
  bookmarkedProperties?: number[];
  onBookmarkClickAction: () => void;
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

const ComparisonInfo = ({
  propertyWithAgent,
  onCompareClick,
  isComparisonActive,
  isComparisonDisabled,
}: {
  propertyWithAgent: PropertyJoinAgent;
  onCompareClick?: () => void;
  isComparisonActive?: boolean;
  isComparisonDisabled?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <ContactAgentDialog
        isWhatsapp={true}
        propertyWithAgent={propertyWithAgent}
      />

      <Tooltip id="compare-btn-tooltip" />
      <Button
        data-tooltip-id="compare-btn-tooltip"
        data-tooltip-content={
          isComparisonDisabled ? "2 properti sudah terpilih" : ""
        }
        data-tooltip-place="top"
        variant={
          isComparisonDisabled
            ? "ghost"
            : isComparisonActive
              ? "default"
              : "outline"
        }
        onClick={onCompareClick}
        disabled={isComparisonDisabled}
      >
        {isComparisonActive ? <LuCircleCheck /> : <LuCircle />}
        COMPARE
      </Button>
    </div>
  );
};

export const PropertyCard = ({
  propertyWithAgent,
  onBookmarkClickAction,
  bookmarkedProperties,
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
        <Button
          size="icon"
          variant="outline"
          className="absolute right-1 top-1"
          onClick={(e) => {
            e.preventDefault();
            bookmarkProperty(propertyWithAgent[0].id);
            onBookmarkClickAction();
          }}
        >
          {bookmarkedProperties?.includes(propertyWithAgent[0].id) ? (
            <LuBookmarkCheck />
          ) : (
            <LuBookmark />
          )}
        </Button>
        <PropertyContent propertyWithAgent={propertyWithAgent} />
      </Link>
      {isComparison ? (
        <ComparisonInfo
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
