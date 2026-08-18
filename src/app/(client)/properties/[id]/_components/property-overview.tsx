import { PropertyInformation } from "./property-information";
import { formatToCurrencyUnit } from "@/lib/intl/format-to-currency-unit";
import { cn } from "@/lib/utils";
import { GoogleTranslateElement } from "@/components/custom-ui/google-translate-element";
import { Property, PropertyJoinAgent, PropertyPurchaseStatus } from "@/lib/types";
import { FACILITY_ICON } from "@/lib/types/facilities";

type PriceTagProps = {
  property: Property;
};

const PriceTag = ({ property }: PriceTagProps) => {
  return (
    <div className="text-primary flex flex-row gap-2 font-bold">
      <div className="text-2xl flex items-center gap-2 ">
        <span>{formatToCurrencyUnit(property.price, property.currency)}</span>
        {property.purchase_status === PropertyPurchaseStatus.ForRent &&
          property.rent_time && <span>{property.rent_time}</span>}
      </div>
      <span
        className={cn(
          "text-md",
          property.price_down_payment && property.price_down_payment > 0
            ? "block"
            : "hidden",
        )}
      >
        (DP:{" "}
        {property?.price_down_payment &&
          property?.price_down_payment > 0 &&
          formatToCurrencyUnit(property.price_down_payment, property.currency)}
        )
      </span>
    </div>
  );
};

type PropertyOverviewProps = {
  property: PropertyJoinAgent;
};

export const PropertyOverview = ({ property }: PropertyOverviewProps) => {
  return (
    <div className="flex flex-col gap-8 flex-1 ">
      <div>
        <GoogleTranslateElement />
        <PriceTag property={property[0]} />
        <h1 className="font-sans uppercase">{property[0].title}</h1>
        <p className="text-muted-foreground capitalize">
          {property[0].building_type} {property[0].street},{" "}
          {property[0].regency}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <PropertyInformation property={property[0]} />
        <div
          className={cn(
            property[0].facilities.length === 0
              ? "hidden"
              : "flex flex-col gap-2",
          )}
        >
          <h3 className="">FASILITAS</h3>
          <ul className="grid grid-cols-2 gap-4">
            {property[0].facilities.map((facility, index) => (
              <li
                key={`${index}-${facility.indonesian_label}`}
                className="flex items-center text-lg gap-2 capitalize"
              >
                <span className="text-muted-foreground">
                  {FACILITY_ICON[facility.value as keyof typeof FACILITY_ICON]}
                </span>
                <span>{facility.indonesian_label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3>DESKRIPSI</h3>
        <p className="whitespace-pre-wrap text-muted-foreground text-base">
          {property[0].description}
        </p>
      </div>

      {property[0].gmap_iframe && (
        <div className="w-full overflow-hidden flex flex-col gap-2">
          <p className="uppercase">Perkiraan Lokasi</p>

          <div
            title={property[0].title}
            className="rounded-mg"
            dangerouslySetInnerHTML={{ __html: property[0].gmap_iframe }}
          />
        </div>
      )}
    </div>
  );
};
