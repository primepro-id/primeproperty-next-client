import { buttonVariants } from "@/components/ui/button";
import { Property, PropertyPurchaseStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

type RelatedSearchProps = {
  property: Property;
  className?: string;
};

export const RelatedSearch = ({ property, className }: RelatedSearchProps) => {
  const purchaseStatus =
    property.purchase_status === PropertyPurchaseStatus.ForRent ? "dijual" : "disewa";
  const buildingType = property.building_type.replaceAll(" ", "-");
  const province = property.province.replaceAll(" ", "-");
  const regency = property.regency.replaceAll(" ", "-");
  const street = property.street.replaceAll(" ", "-");

  return (
    <div id="related" className={cn("rounded border h-fit", className)}>
      <h3 className="border-b py-2 px-4">PENCARIAN TERKAIT</h3>

      <div className="flex flex-col gap-2">
        <Link
          className={cn(
            buttonVariants({
              variant: "link",
              className: "capitalize text-base justify-between",
            }),
          )}
          title={`${property.building_type} ${purchaseStatus} ${property.province}`}
          aria-label={`${property.building_type} ${purchaseStatus} ${property.province}`}
          href={`/properties/filter/${purchaseStatus}/${buildingType}/${province}`}
        >
          <span>
            {property.building_type} {purchaseStatus} {property.province}
          </span>
          <LuChevronRight />
        </Link>
        <Link
          className={cn(
            buttonVariants({
              variant: "link",
              className: "capitalize text-base justify-between",
            }),
          )}
          title={`${property.building_type} ${purchaseStatus} ${property.regency}`}
          aria-label={`${property.building_type} ${purchaseStatus} ${property.regency}`}
          href={`/properties/filter/${purchaseStatus}/${buildingType}/${province}/${regency}`}
        >
          <span>
            {property.building_type} {purchaseStatus} {property.regency}
          </span>
          <LuChevronRight />
        </Link>
        <Link
          className={cn(
            buttonVariants({
              variant: "link",
              className: "capitalize text-base justify-between",
            }),
          )}
          title={`${property.building_type} ${purchaseStatus} ${property.street}`}
          aria-label={`${property.building_type} ${purchaseStatus} ${property.street}`}
          href={`/properties/filter/${purchaseStatus}/${buildingType}/${province}/${regency}/${street}`}
        >
          <span>
            {property.building_type} {purchaseStatus} {property.street}
          </span>
          <LuChevronRight />
        </Link>
      </div>
    </div>
  );
};
