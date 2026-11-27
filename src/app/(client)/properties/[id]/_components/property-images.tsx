"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { PropertyCarousel } from "./property-carousel";
import { PropertyDialogCarousel } from "./property-dialog-carousel";
import { PropertyJoinAgent } from "@/lib/types";

type PropertyImagesProps = {
  propertyWithAgent: PropertyJoinAgent;
  id?: string;
};

export const PropertyImages = ({
  propertyWithAgent,
  id,
}: PropertyImagesProps) => {
  const [dialogCarouselindex, setDialogCarouselIndex] = useState<number | null>(
    null,
  );
  return (
    <div id={id}>
      <PropertyCarousel
        propertyWithAgent={propertyWithAgent}
        onImageClick={(imgIndex) => setDialogCarouselIndex(imgIndex)}
      />
      <Dialog
        open={dialogCarouselindex !== null ? dialogCarouselindex >= 0 : false}
      >
        <DialogContent
          className="max-w-3xl z-[60] border border-primary"
          overlayClassName="z-[60]"
          onEscapeKeyDown={() => setDialogCarouselIndex(null)}
          onOverlayClick={() => setDialogCarouselIndex(null)}
        >
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <PropertyDialogCarousel
            onCloseClick={() => setDialogCarouselIndex(null)}
            startIndex={dialogCarouselindex !== null ? dialogCarouselindex : 0}
            propertyWithAgent={propertyWithAgent}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
