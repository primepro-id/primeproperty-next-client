"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PropertyBookmarkButton } from "../../_components/property-bookmark-button";
import type { IndexedPropertyImage } from "../_lib/order-property-images";
import { BackButton } from "./back-button";
import { PropertyGalleryBadges } from "./property-gallery-badges";
import { PropertyGalleryImage } from "./property-gallery-image";
import { PropertyShareButton } from "./property-share-button";

type PropertyMobileGalleryProps = {
  property: Property;
  images: IndexedPropertyImage[];
  onImageClick: (index: number) => void;
  className?: string;
};

export const PropertyMobileGallery = ({
  property,
  images,
  onImageClick,
  className,
}: PropertyMobileGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    if (!api) {
      return;
    }
    const handleSelect = () => setCurrentSlide(api.selectedScrollSnap() + 1);
    handleSelect();
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className={cn("relative -mx-2", className)}>
      <Carousel setApi={setApi}>
        <CarouselContent className="ml-0">
          {images.map((image, index) => (
            <CarouselItem
              key={`${image.originalIndex}_${image.path}_mobile`}
              className="h-64 pl-0 sm:h-96"
            >
              <PropertyGalleryImage
                path={image.path}
                alt={image.indonesian_label || property.title}
                isPriority={index === 0}
                onClick={() => onImageClick(image.originalIndex)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <BackButton className="absolute left-3 top-3 rounded-full bg-background/90" />
      <div className="absolute right-3 top-3 flex gap-2">
        <PropertyShareButton
          title={property.title}
          className="rounded-full bg-background/90"
        />
        <PropertyBookmarkButton
          propertyId={property.id}
          className="static size-9 rounded-full border-0 bg-background/90"
        />
      </div>
      <PropertyGalleryBadges property={property} />
      {images.length > 1 && (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-sm text-white">
          {currentSlide} / {images.length}
        </span>
      )}
    </div>
  );
};
