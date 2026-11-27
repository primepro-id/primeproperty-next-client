import { LuMapPin } from "react-icons/lu";
import { formatToCurrencyUnit } from "@/lib/intl/format-to-currency-unit";
import type { Property } from "@/lib/types";
import { formatPropertyLocation } from "../_lib/property-labels";
import { PropertyPrice } from "./property-price";

type PropertyHeaderProps = {
  property: Property;
};

export const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  const priceNotes = [
    property.price_down_payment && property.price_down_payment > 0
      ? `DP ${formatToCurrencyUnit(property.price_down_payment, property.currency)}`
      : null,
    property.configurations.is_njop_price ? "Harga NJOP" : null,
  ].filter(Boolean);

  return (
    <header className="flex flex-col gap-1">
      <p className="text-2xl font-bold text-primary lg:text-3xl">
        <PropertyPrice property={property} />
      </p>
      {priceNotes.length > 0 && (
        <p className="text-sm text-muted-foreground">{priceNotes.join(" · ")}</p>
      )}
      <h1 className="mt-2 font-sans text-xl font-semibold leading-snug lg:text-2xl">
        {property.title}
      </h1>
      <p className="flex items-center gap-1 text-sm text-muted-foreground">
        <LuMapPin className="shrink-0" aria-hidden="true" />
        <span>{formatPropertyLocation(property)}</span>
      </p>
    </header>
  );
};
