"use client";

import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PropertyNavigation } from "@/lib/types";
import { PropertyPurchaseStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createFooterNavigationGroups } from "./footer-navigation-data";

type PropertyNavigationListProps = {
  navigations: PropertyNavigation[];
  purchaseStatus: PropertyPurchaseStatus;
};

const PropertyNavigationList = ({
  navigations,
  purchaseStatus,
}: PropertyNavigationListProps) => {
  const groups = createFooterNavigationGroups(navigations, purchaseStatus);
  const isForSale = purchaseStatus === PropertyPurchaseStatus.ForSale;

  return (
    <div className="flex gap-16 h-fit overflow-y-hidden overflow-x-auto">
      <div className="flex flex-col">
        {groups.buildingTypes.map((buildingType) => (
          <Link
            key={buildingType.label}
            title={buildingType.label}
            href={buildingType.href}
            className={cn(
              buttonVariants({ variant: "link" }),
              "justify-start capitalize text-sm px-0 font-sans",
            )}
          >
            {buildingType.label}
          </Link>
        ))}
      </div>
      {isForSale ? (
        <div className="flex flex-col">
          {groups.homeRegencies.map((regency) => (
            <Link
              key={regency.label}
              title={`Rumah dijual ${regency.label}`}
              href={regency.href}
              className={cn(
                buttonVariants({ variant: "link" }),
                "justify-start text-sm px-0 font-sans gap-1",
              )}
            >
              Rumah dijual
              <span className="capitalize">{regency.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
      <div
        className={cn(
          "flex flex-col flex-wrap gap-x-16",
          isForSale ? "max-h-[500px]" : "max-h-72",
        )}
      >
        {groups.homeStreets.map((street) => (
          <Link
            key={street.label}
            title={`Rumah ${isForSale ? "dijual" : "disewa"} ${street.label}`}
            href={street.href}
            className={cn(
              buttonVariants({ variant: "link" }),
              "justify-start text-sm px-0 font-sans gap-1",
            )}
          >
            Rumah {isForSale ? "dijual" : "disewa"}
            <span className="capitalize">{street.label}</span>
          </Link>
        ))}
        {!isForSale
          ? groups.apartmentStreets.map((street) => (
              <Link
                key={street.label}
                title={`Apartemen disewa ${street.label}`}
                href={street.href}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "justify-start text-sm px-0 font-sans gap-1",
                )}
              >
                Apartemen disewa
                <span className="capitalize">{street.label}</span>
              </Link>
            ))
          : null}
      </div>
    </div>
  );
};

type FooterNavigationProps = {
  navigations: PropertyNavigation[];
};

export const FooterNavigation = ({ navigations }: FooterNavigationProps) => (
  <Tabs defaultValue="dijual">
    <TabsList>
      <TabsTrigger value="dijual" className="text-base">
        Properti Dijual
      </TabsTrigger>
      <TabsTrigger value="disewa" className="text-base">
        Properti Disewa
      </TabsTrigger>
    </TabsList>
    <TabsContent value="dijual" className="border-y border-primary px-4 mt-0">
      <PropertyNavigationList
        navigations={navigations}
        purchaseStatus={PropertyPurchaseStatus.ForSale}
      />
    </TabsContent>
    <TabsContent value="disewa" className="border-y border-primary px-4 mt-0">
      <PropertyNavigationList
        navigations={navigations}
        purchaseStatus={PropertyPurchaseStatus.ForRent}
      />
    </TabsContent>
  </Tabs>
);
