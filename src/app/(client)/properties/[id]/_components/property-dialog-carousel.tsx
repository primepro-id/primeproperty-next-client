import { env } from "@/lib/env";
import { LuTag, LuX } from "react-icons/lu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ContactAgentDialog } from "../../_components/contact-agent-dialog";
import { WatermarkImage } from "@/components/custom-ui/watermark-image";
import { PropertyJoinAgent } from "@/lib/types";

type PropertyDialogCarouselProps = {
  startIndex: number;
  propertyWithAgent: PropertyJoinAgent;
  onCloseClick: () => void;
};

export const PropertyDialogCarousel = ({
  startIndex,
  propertyWithAgent,
  onCloseClick,
}: PropertyDialogCarouselProps) => {
  const baseImgPath = env.NEXT_PUBLIC_S3_ENDPOINT;
  return (
    <div className="relative">
      <DialogClose
        onClick={onCloseClick}
        className={cn(
          buttonVariants({ size: "icon" }),
          "absolute -top-2 -right-2 z-50 rounded-full border border-background",
        )}
      >
        <LuX />
      </DialogClose>
      <Carousel opts={{ startIndex: startIndex }}>
        <CarouselContent>
          {propertyWithAgent[0].images.map((propImg, index) => (
            <CarouselItem key={`${index}_${propImg.path}_carousel`}>
              <div className="relative cursor-ew-resize">
                <WatermarkImage
                  watermarkProps={{
                    fontSize: 24,
                  }}
                  imageProps={{
                    src: baseImgPath + propImg.path,
                    alt: propertyWithAgent[0].title,
                    width: 1024,
                    height: 768,
                    className:
                      "w-full rounded-lg size-96 md:h-[75vh] object-fill aspect-square",
                  }}
                />
                {propImg.indonesian_label && (
                  <div className="bg-primary text-primary-foreground text-xs flex gap-1 absolute left-0 top-0 items-center px-1 py-0.5 rounded-md">
                    <LuTag />
                    <span>{propImg.indonesian_label}</span>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-between mt-4">
          <ContactAgentDialog
            isWhatsapp
            isPhotoRequest
            propertyWithAgent={propertyWithAgent}
          />
          <div className="flex items-center gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>
      </Carousel>
    </div>
  );
};
