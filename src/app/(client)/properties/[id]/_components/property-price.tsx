import { formatToCurrencyUnit } from "@/lib/intl/format-to-currency-unit";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getRentTimeLabel } from "../_lib/property-labels";

type PropertyPriceProps = {
  property: Property;
  className?: string;
};

export const PropertyPrice = ({ property, className }: PropertyPriceProps) => {
  const rentTimeLabel = getRentTimeLabel(property);

  return (
    <span className={cn("capitalize", className)}>
      {formatToCurrencyUnit(property.price, property.currency)}
      {rentTimeLabel && (
        <span className="ml-1 text-sm font-normal normal-case text-muted-foreground">
          {rentTimeLabel}
        </span>
      )}
    </span>
  );
};
