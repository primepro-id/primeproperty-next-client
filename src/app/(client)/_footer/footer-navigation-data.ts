import type { PropertyNavigation, PropertyPurchaseStatus } from "@/lib/types";
import { toSlug } from "@/lib/utils";

type FooterNavigationLink = {
  label: string;
  href: string;
};

export type FooterNavigationGroups = {
  buildingTypes: FooterNavigationLink[];
  homeRegencies: FooterNavigationLink[];
  homeStreets: FooterNavigationLink[];
  apartmentStreets: FooterNavigationLink[];
};

const uniqueLinks = (links: FooterNavigationLink[]) =>
  Array.from(
    links
      .reduce((items, link) => items.set(link.label, link), new Map())
      .values(),
  );

export const createFooterNavigationGroups = (
  navigations: PropertyNavigation[],
  purchaseStatus: PropertyPurchaseStatus,
): FooterNavigationGroups => {
  const statusPath = purchaseStatus === "ForSale" ? "dijual" : "disewa";
  const filteredNavigations = navigations
    .filter((navigation) => navigation.purchase_status === purchaseStatus)
    .sort((a, b) => a.building_type.localeCompare(b.building_type));
  const createHref = (...segments: string[]) =>
    toSlug(`/properties/filter/${segments.join("/")}`);

  return {
    buildingTypes: uniqueLinks(
      filteredNavigations.map((navigation) => ({
        label: navigation.building_type,
        href: createHref(statusPath, navigation.building_type),
      })),
    ),
    homeRegencies: uniqueLinks(
      filteredNavigations
        .filter((navigation) => navigation.building_type === "rumah")
        .sort((a, b) => a.regency.localeCompare(b.regency))
        .map((navigation) => ({
          label: navigation.regency,
          href: createHref(
            statusPath,
            "rumah",
            navigation.province,
            navigation.regency,
          ),
        })),
    ),
    homeStreets: uniqueLinks(
      filteredNavigations
        .filter((navigation) => navigation.building_type === "rumah")
        .sort((a, b) => a.street.localeCompare(b.street))
        .map((navigation) => ({
          label: navigation.street,
          href: createHref(
            statusPath,
            "rumah",
            navigation.province,
            navigation.regency,
            navigation.street,
          ),
        })),
    ),
    apartmentStreets: uniqueLinks(
      filteredNavigations
        .filter((navigation) => navigation.building_type === "apartemen")
        .sort((a, b) => a.street.localeCompare(b.street))
        .map((navigation) => ({
          label: navigation.street,
          href: createHref(
            statusPath,
            "apartemen",
            navigation.province,
            navigation.regency,
            navigation.street,
          ),
        })),
    ),
  };
};
