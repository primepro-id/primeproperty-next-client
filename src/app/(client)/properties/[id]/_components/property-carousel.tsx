import { PropertyJoinAgent } from "@/lib/types";
import { orderPropertyImages } from "../_lib/order-property-images";
import { PropertyBentoGallery } from "./property-bento-gallery";
import { PropertyGalleryBadges } from "./property-gallery-badges";
import { PropertyGalleryImage } from "./property-gallery-image";
import { PropertyMobileGallery } from "./property-mobile-gallery";

type PropertyCarouselProps = {
  propertyWithAgent: PropertyJoinAgent;
  onImageClick: (imageIndex: number) => void;
};

export const PropertyCarousel = ({
  propertyWithAgent,
  onImageClick,
}: PropertyCarouselProps) => {
  const property = propertyWithAgent[0];
  const images = orderPropertyImages(property.images);

  if (images.length === 0) {
    return (
      <div className="relative -mx-2 h-64 overflow-hidden sm:h-96 lg:mx-0 lg:h-[28rem] lg:rounded-xl">
        <PropertyGalleryImage alt={property.title} isPriority />
        <PropertyGalleryBadges property={property} />
      </div>
    );
  }

  return (
    <div onContextMenu={(event) => event.preventDefault()}>
      <PropertyMobileGallery
        property={property}
        images={images}
        onImageClick={onImageClick}
        className="lg:hidden"
      />
      <PropertyBentoGallery
        property={property}
        images={images}
        onImageClick={onImageClick}
        className="hidden lg:grid"
      />
    </div>
  );
};
