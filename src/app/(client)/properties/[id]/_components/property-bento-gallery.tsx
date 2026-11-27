import { LuLayoutGrid } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { IndexedPropertyImage } from "../_lib/order-property-images";
import { PropertyGalleryBadges } from "./property-gallery-badges";
import { PropertyGalleryImage } from "./property-gallery-image";

type PropertyBentoGalleryProps = {
  property: Property;
  images: IndexedPropertyImage[];
  onImageClick: (index: number) => void;
  className?: string;
};

const MAX_BENTO_IMAGES = 5;

const GRID_LAYOUTS: Record<number, string> = {
  1: "grid-cols-1 grid-rows-1",
  2: "grid-cols-2 grid-rows-1",
  3: "grid-cols-3 grid-rows-2",
  4: "grid-cols-4 grid-rows-2",
  5: "grid-cols-4 grid-rows-2",
};

export const PropertyBentoGallery = ({
  property,
  images,
  onImageClick,
  className,
}: PropertyBentoGalleryProps) => {
  const shownImages = images.slice(0, MAX_BENTO_IMAGES);
  const [coverImage, ...tileImages] = shownImages;
  const hasLargeCover = shownImages.length >= 3;

  return (
    <div
      className={cn(
        "relative grid h-[28rem] gap-2 overflow-hidden rounded-xl",
        GRID_LAYOUTS[shownImages.length],
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          hasLargeCover && "col-span-2 row-span-2",
        )}
      >
        <PropertyGalleryImage
          path={coverImage.path}
          alt={coverImage.indonesian_label || property.title}
          isPriority
          onClick={() => onImageClick(coverImage.originalIndex)}
        />
        <PropertyGalleryBadges property={property} />
      </div>
      {tileImages.map((image, index) => (
        <PropertyGalleryImage
          key={`${image.originalIndex}_${image.path}_bento`}
          path={image.path}
          alt={image.indonesian_label || property.title}
          label={image.indonesian_label}
          watermarkFontSize={24}
          className={cn(
            shownImages.length === 4 && index === 0 && "col-span-2",
          )}
          onClick={() => onImageClick(image.originalIndex)}
        />
      ))}
      {images.length > 1 && (
        <Button
          type="button"
          variant="secondary"
          className="absolute bottom-3 right-3 border bg-background hover:bg-muted"
          onClick={() => onImageClick(coverImage.originalIndex)}
        >
          <LuLayoutGrid aria-hidden="true" />
          Lihat {images.length} foto
        </Button>
      )}
    </div>
  );
};
