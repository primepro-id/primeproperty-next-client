import Link from "next/link";
import { Property, PropertyPurchaseStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toTitleCase } from "../_lib/property-labels";

type RelatedSearchProps = {
  property: Property;
  className?: string;
};

type RelatedSearchLink = {
  label: string;
  href: string;
};

function toSlug(value: string) {
  return value.replaceAll(" ", "-");
}

export const RelatedSearch = ({ property, className }: RelatedSearchProps) => {
  const purchaseStatus =
    property.purchase_status === PropertyPurchaseStatus.ForRent
      ? "disewa"
      : "dijual";
  const oppositePurchaseStatus =
    purchaseStatus === "dijual" ? "disewa" : "dijual";
  const buildingType = toSlug(property.building_type);
  const province = toSlug(property.province);
  const regency = toSlug(property.regency);
  const street = toSlug(property.street);
  const typeLabel = toTitleCase(property.building_type);

  const links: RelatedSearchLink[] = [
    {
      label: `${typeLabel} ${purchaseStatus} ${toTitleCase(property.province)}`,
      href: `/properties/filter/${purchaseStatus}/${buildingType}/${province}`,
    },
    {
      label: `${typeLabel} ${purchaseStatus} ${toTitleCase(property.regency)}`,
      href: `/properties/filter/${purchaseStatus}/${buildingType}/${province}/${regency}`,
    },
    {
      label: `${typeLabel} ${purchaseStatus} ${toTitleCase(property.street)}`,
      href: `/properties/filter/${purchaseStatus}/${buildingType}/${province}/${regency}/${street}`,
    },
    {
      label: `${typeLabel} ${oppositePurchaseStatus} ${toTitleCase(property.regency)}`,
      href: `/properties/filter/${oppositePurchaseStatus}/${buildingType}/${province}/${regency}`,
    },
  ];

  return (
    <section
      id="related"
      aria-labelledby="related-heading"
      className={cn("flex flex-col gap-3", className)}
    >
      <h2 id="related-heading" className="font-sans text-lg font-semibold">
        Pencarian terkait
      </h2>
      <ul className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {links.map((link) => (
          <li key={link.href} className="shrink-0">
            <Link
              href={link.href}
              title={link.label}
              className="block whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
