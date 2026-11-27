import Image from "next/image";
import { DEVELOPERS } from "@/lib/developers";
import { env } from "@/lib/env";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getPurchaseStatusLabel } from "../_lib/property-labels";

type PropertyGalleryBadgesProps = {
  property: Property;
  className?: string;
};

export const PropertyGalleryBadges = ({
  property,
  className,
}: PropertyGalleryBadgesProps) => {
  const developer = property.developer_id
    ? DEVELOPERS.find((item) => item.id === property.developer_id)
    : undefined;

  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-3 left-3 flex flex-col items-start gap-2",
        className,
      )}
    >
      {developer && (
        <div className="flex size-14 items-center justify-center rounded-md bg-white/90 p-2">
          <Image
            src={env.NEXT_PUBLIC_S3_ENDPOINT + developer.logo_path}
            alt={`Developer ${developer.name}`}
            width={48}
            height={48}
            className="h-auto w-full"
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-md bg-primary px-2 py-0.5 text-sm font-medium capitalize text-primary-foreground">
          {property.building_type} · {getPurchaseStatusLabel(property.purchase_status)}
        </span>
        {property.configurations.is_njop_price && (
          <span className="rounded-md bg-background/90 px-2 py-0.5 text-sm font-medium">
            Harga NJOP
          </span>
        )}
      </div>
    </div>
  );
};
