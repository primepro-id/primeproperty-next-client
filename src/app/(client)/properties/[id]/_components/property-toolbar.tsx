import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PropertyBookmarkButton } from "../../_components/property-bookmark-button";
import { BackButton } from "./back-button";
import { PropertyBreadcrumb } from "./property-breadcrumb";
import { PropertyShareButton } from "./property-share-button";

type PropertyToolbarProps = {
  property: Property;
  className?: string;
};

export const PropertyToolbar = ({
  property,
  className,
}: PropertyToolbarProps) => {
  return (
    <div className={cn("hidden md:flex items-center gap-3", className)}>
      <BackButton className="hidden shrink-0 rounded-full lg:inline-flex" />
      <PropertyBreadcrumb property={property} className="flex-1" />
      <div className="flex shrink-0 items-center gap-2">
        <PropertyShareButton
          title={property.title}
          className="hidden rounded-full lg:inline-flex"
        />
        <PropertyBookmarkButton
          propertyId={property.id}
          className="static hidden size-9 rounded-full lg:inline-flex"
        />
      </div>
    </div>
  );
};
