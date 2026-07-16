import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { usePropertiesNavigation } from "@/hooks/properties/use-properties-navigation";
import { PropertyNavigation } from "@/lib/api/properties/find-property-navigation";
import { PurchaseStatus } from "@/lib/enums/purchase-status";
import { useState } from "react";
import { toSlug } from "@/lib/utils";

type PropertyNavigationMenuContentProps = {
  isLoading: boolean;
  data?: PropertyNavigation[];
  purchaseStatus: PurchaseStatus;
};

const PropertyNavigationMenuContent = ({
  isLoading,
  data,
  purchaseStatus,
}: PropertyNavigationMenuContentProps) => {
  const purchaseStatusPath =
    purchaseStatus === PurchaseStatus.ForSale ? "/dijual" : "/disewa";
  const [selectedBuildType, setSelectedBuildType] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");

  if (isLoading) {
    return (
      <div className="w-[600px] p-4">
        <div className="bg-primary h-10 animate-pulse rounded" />
      </div>
    );
  }

  const buildingTypes = new Map(
    data
      ?.sort((a, b) => a.building_type.localeCompare(b.building_type))
      .map((d) => [
        d.building_type,
        {
          label: d.building_type,
          value: `${purchaseStatusPath}/${toSlug(d.building_type)}`,
        },
      ]),
  );

  const distinctProvinceByBuildingType = new Map(
    data
      ?.filter((d) => d.building_type === selectedBuildType)
      ?.sort((a, b) => a.province.localeCompare(b.province))
      .map((d) => [
        d.province,
        {
          label: d.province,
          value: `${purchaseStatusPath}/${toSlug(selectedBuildType)}/${toSlug(d.province)}`,
        },
      ]),
  );
  const distinctRegencyByProvince = new Map(
    data
      ?.filter(
        (d) =>
          d.building_type === selectedBuildType &&
          d.province === selectedProvince,
      )
      .sort((a, b) => a.regency.localeCompare(b.regency))
      .map((d) => [
        d.regency,
        {
          label: d.regency,
          value: `${purchaseStatusPath}/${toSlug(selectedBuildType)}/${toSlug(selectedProvince)}/${toSlug(d.regency)}`,
        },
      ]),
  );
  const distinctStreetByRegency = new Map(
    data
      ?.filter(
        (d) =>
          d.building_type === selectedBuildType &&
          d.province === selectedProvince &&
          d.regency === selectedRegency,
      )
      .sort((a, b) => a.street.localeCompare(b.street))
      .map((d) => [
        d.street,
        {
          label: d.street,
          value: `${purchaseStatusPath}/${toSlug(selectedBuildType)}/${toSlug(selectedProvince)}/${toSlug(selectedRegency)}/${toSlug(d.street)}`,
        },
      ]),
  );

  return (
    <div className="w-[800px] grid grid-cols-4 divide-x-2 divide-x-primary overflow-x-hidden">
      <div className="flex flex-col divide-y">
        {Array.from(buildingTypes?.values()).map((item) => (
          <Link
            href={`/properties/filter${item.value}`}
            key={item.value}
            title={`Lihat semua ${item.label}`}
            className={cn(
              "px-4 py-2 flex items-center justify-between gap-2 capitalize hover:bg-primary/50 dark:hover:text-primary-foreground",
              selectedBuildType === item.label
                ? "bg-primary text-primary-foreground"
                : "",
            )}
            onMouseEnter={() => {
              setSelectedBuildType(item.label);
              setSelectedProvince("");
              setSelectedRegency("");
            }}
          >
            {item.label}

            <IoIosArrowForward />
          </Link>
        ))}
      </div>
      <div
        className={cn(
          "flex-col divide-y",
          selectedBuildType !== "" ? "flex" : "hidden",
        )}
      >
        {Array.from(distinctProvinceByBuildingType?.values()).map((item) => (
          <Link
            href={`/properties/filter${item.value}`}
            key={item.value}
            title={`Lihat ${selectedBuildType} di ${item.label}`}
            className={cn(
              "px-4 py-2 flex items-center justify-between gap-2 capitalize hover:bg-primary/50 dark:hover:text-primary-foreground",
              selectedProvince === item.label
                ? "bg-primary text-primary-foreground"
                : "",
            )}
            onMouseEnter={() => {
              setSelectedProvince(item.label);
              setSelectedRegency("");
            }}
          >
            {item.label}

            <IoIosArrowForward />
          </Link>
        ))}
      </div>
      <div
        className={cn(
          "flex-col divide-y",
          Array.from(distinctRegencyByProvince).length > 0 ? "flex" : "hidden",
        )}
      >
        {Array.from(distinctRegencyByProvince?.values()).map((item) => (
          <Link
            href={`/properties/filter${item.value}`}
            key={item.value}
            title={`Lihat ${selectedBuildType} di ${item.label}`}
            className={cn(
              "px-4 py-2 flex items-center justify-between gap-2 capitalize hover:bg-primary/50 dark:hover:text-primary-foreground",
              selectedRegency === item.label
                ? "bg-primary text-primary-foreground"
                : "",
            )}
            onMouseEnter={() => setSelectedRegency(item.label)}
          >
            {item.label}

            <IoIosArrowForward />
          </Link>
        ))}
      </div>
      <div
        className={cn(
          "flex-col divide-y  max-h-[600px] overflow-y-auto",
          Array.from(distinctStreetByRegency).length > 0 ? "flex" : "hidden",
        )}
      >
        {Array.from(distinctStreetByRegency?.values()).map((item) => (
          <Link
            href={`/properties/filter${item.value}`}
            key={item.value}
            title={`Lihat ${selectedBuildType} di ${item.label}`}
            className={cn(
              "px-4 py-2 flex items-center justify-between gap-2 capitalize hover:bg-primary/50 dark:hover:text-primary-foreground",
            )}
          >
            {item.label}

            <IoIosArrowForward />
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Navigation = () => {
  const MENU = [
    {
      title: "AGEN",
      href: "/agents",
    },
    {
      title: "BLOG",
      href: "/blog",
    },
    {
      title: "KARIR",
      href: "/jobs",
    },
    {
      title: "FRANCHISE",
      href: "/franchise",
    },
    {
      title: "TENTANG",
      href: "/about",
    },
    {
      title: "PERBANDINGAN",
      href: "/properties/bookmark",
    },
  ];

  const nav = usePropertiesNavigation();
  const forSaleNav = nav?.data?.data?.filter(
    (b) => b.purchase_status === PurchaseStatus.ForSale,
  );
  const forRentNav = nav?.data?.data?.filter(
    (b) => b.purchase_status === PurchaseStatus.ForRent,
  );
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/properties"
              title="Properti"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "font-sans",
              )}
            >
              PROPERTI
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="lg:hidden xl:block">
          <NavigationMenuTrigger className="font-sans bg-transparent">
            DIJUAL
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-gradient-to-br from-primary/50 to-transparent">
            <PropertyNavigationMenuContent
              isLoading={nav.isLoading}
              data={forSaleNav}
              purchaseStatus={PurchaseStatus.ForSale}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="lg:hidden xl:block">
          <NavigationMenuTrigger className="font-sans bg-transparent">
            DISEWA
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-gradient-to-br from-primary/50 to-transparent">
            <PropertyNavigationMenuContent
              isLoading={nav.isLoading}
              data={forRentNav}
              purchaseStatus={PurchaseStatus.ForRent}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
        {MENU.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                title={item.title}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "font-sans",
                )}
              >
                {item.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
