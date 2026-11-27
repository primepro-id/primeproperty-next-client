import { LuTag } from "react-icons/lu";
import { WatermarkImage } from "@/components/custom-ui/watermark-image";
import { getPropertyImageSrc } from "@/lib/property-image";
import { cn } from "@/lib/utils";

type PropertyGalleryImageProps = {
  path?: string;
  alt: string;
  label?: string;
  isPriority?: boolean;
  watermarkFontSize?: number;
  className?: string;
  onClick?: () => void;
};

export const PropertyGalleryImage = ({
  path,
  alt,
  label,
  isPriority = false,
  watermarkFontSize,
  className,
  onClick,
}: PropertyGalleryImageProps) => {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <WatermarkImage
        watermarkProps={{
          className: "h-full w-full",
          ...(watermarkFontSize ? { fontSize: watermarkFontSize } : {}),
        }}
        imageProps={{
          src: getPropertyImageSrc(path),
          alt,
          width: 1024,
          height: 768,
          loading: isPriority ? "eager" : "lazy",
          fetchPriority: isPriority ? "high" : "auto",
          onClick,
          className: cn(
            "h-full w-full object-cover",
            onClick && "cursor-zoom-in",
          ),
        }}
      />
      {label && (
        <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-0.5 text-sm capitalize">
          <LuTag aria-hidden="true" />
          {label}
        </span>
      )}
    </div>
  );
};
