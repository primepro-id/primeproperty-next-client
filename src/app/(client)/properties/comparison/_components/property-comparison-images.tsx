"use client";

import { WatermarkImage } from "@/components/custom-ui/watermark-image";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { LuTag } from "react-icons/lu";
import { PropertyDialogCarousel } from "../../[id]/_components/property-dialog-carousel";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { PropertyJoinAgent } from "@/lib/types";

type PropertyComparisonImagesProps = {
  propertyWithAgent: PropertyJoinAgent;
};

export const PropertyComparisonImages = ({
  propertyWithAgent,
}: PropertyComparisonImagesProps) => {
  const baseImgPath = env.NEXT_PUBLIC_S3_ENDPOINT;
  const [startIndex, setStartIndex] = useState<null | number>(null);
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 w-full md:flex md:items-center">
        {propertyWithAgent[0].images.map((img, i) => (
          <button
            className={cn(
              "relative cursor-zoom-in ",
              i > 2 && "hidden md:block",
            )}
            key={img.indonesian_label + i}
            onClick={() => setStartIndex(i)}
          >
            <WatermarkImage
              watermarkProps={{ className: "w-fit" }}
              imageProps={{
                src: baseImgPath + img.path,
                alt: img.indonesian_label,
                width: 1024,
                height: 1024,
                className: cn("size-24 rounded-lg aspect-square object-cover"),
              }}
            />
            {img.indonesian_label && (
              <div className="bg-primary text-primary-foreground text-xs flex gap-1 absolute right-1 bottom-1 items-center px-2 py-1 rounded">
                <LuTag />
                <span>{img.indonesian_label}</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <Dialog open={startIndex !== null ? startIndex >= 0 : false}>
        <DialogContent
          className="max-w-3xl z-[60] border border-primary"
          overlayClassName="z-[60]"
          onEscapeKeyDown={() => setStartIndex(null)}
          onOverlayClick={() => setStartIndex(null)}
        >
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <PropertyDialogCarousel
            onCloseClick={() => setStartIndex(null)}
            startIndex={startIndex !== null ? startIndex : 0}
            propertyWithAgent={propertyWithAgent}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
