"use client";
import { createOrganizationSchema } from "@/lib/schema";
import Image from "next/image";
import Script from "next/script";
import { MdOutlineLocationOn } from "react-icons/md";
import Link from "next/link";
import {
  LuFacebook,
  LuInstagram,
  LuLinkedin,
  LuYoutube,
  LuMail,
  LuPhone,
} from "react-icons/lu";
import { buttonVariants } from "@/components/ui/button";
import { cn, toSlug } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyNavigation, PropertyPurchaseStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { findPropertyNavigationQueryOptions } from "@/lib/hooks";

const Organization = () => {
  return (
    <div
      id="organization"
      className="flex flex-col md:flex-row gap-4 md:gap-12"
    >
      <div className="flex items-center gap-4">
        <LuMail />
        <p>primeproagent@gmail.com</p>
      </div>
      <div className="flex items-center gap-4">
        <LuPhone />
        <p>+62-821-1616-2995</p>
      </div>
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <MdOutlineLocationOn />
        </div>
        <div className="lg:flex gap-1">
          <p>Jl Pakubuwono VI No. 35,</p>
          <p>Kebayoran Baru,</p>
          <p>Jakarta Selatan, 12120</p>
        </div>
      </div>
    </div>
  );
};

const SocialMedia = () => {
  const SOCIALS = [
    {
      title: "Facebook Primepro Indonesia",
      href: "https://www.facebook.com/share/1BHTU7HvZx/",
      icon: <LuFacebook />,
    },
    {
      title: "Instagram Primepro Indonesia",
      href: "https://www.instagram.com/primepro_id/",
      icon: <LuInstagram />,
    },
    {
      title: "Linkedin Primepro Indonesia",
      href: "https://www.linkedin.com/company/primepro-indonesia/",
      icon: <LuLinkedin />,
    },
    {
      title: "Youtube Primepro Indonesia",
      href: "https://www.youtube.com/@primeproindonesia",
      icon: <LuYoutube />,
    },
  ];
  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="/images/primepro.png"
          alt="PrimePro Indonesia"
          width={25}
          height={25}
          id="logo"
        />
        <p className="text-xl font-bold">PRIMEPRO INDONESIA</p>
      </div>
      <div className="flex items-center gap-4">
        {SOCIALS.map((soc) => (
          <Link
            key={soc.title}
            title={soc.title}
            href={soc.href}
            className={cn(buttonVariants({ size: "icon" }))}
          >
            {soc.icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

type ForSaleListProps = {
  navigations?: PropertyNavigation[];
};

const ForSaleList = ({ navigations }: ForSaleListProps) => {
  const forSaleBuildingTypes = new Map(
    navigations
      ?.sort((a, b) => a.building_type.localeCompare(b.building_type))
      .map((d) => [
        d.building_type,
        {
          label: d.building_type,
          value: `/dijual/${toSlug(d.building_type)}`,
        },
      ]),
  );
  const forSaleHomeRegency = new Map(
    navigations
      ?.filter((b) => b.building_type === "rumah")
      .sort((a, b) => a.regency.localeCompare(b.regency))
      .map((d) => [
        d.regency,
        {
          label: d.regency,
          value: `/dijual/rumah/${toSlug(d.province)}/${toSlug(d.regency)}`,
        },
      ]),
  );
  const forSaleHomeStreet = new Map(
    navigations
      ?.filter((b) => b.building_type === "rumah")
      .sort((a, b) => a.street.localeCompare(b.street))
      .map((d) => [
        d.street,
        {
          label: d.street,
          value: `/dijual/rumah/${toSlug(d.province)}/${toSlug(d.regency)}/${d.street}`,
        },
      ]),
  );
  return (
    <div className="flex gap-16 h-fit overflow-y-hidden overflow-x-auto">
      <div className="flex flex-col">
        {Array.from(forSaleBuildingTypes.values()).map((b) => (
          <Link
            key={b.label}
            title={b.label}
            href={`/properties/filter${b.value}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "justify-start capitalize text-sm px-0 font-sans ",
            )}
          >
            {b.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col ">
        {Array.from(forSaleHomeRegency.values()).map((b) => (
          <Link
            key={b.label}
            title={`Rumah dijual ${b.label}`}
            href={`/properties/filter${b.value}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "justify-start text-sm px-0 font-sans gap-1",
            )}
          >
            Rumah dijual
            <span className="capitalize ">{b.label}</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-col flex-wrap max-h-[500px] gap-x-16">
        {Array.from(forSaleHomeStreet.values()).map((b) => (
          <Link
            key={b.label}
            title={`Rumah dijual ${b.label}`}
            href={`/properties/filter${b.value}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "justify-start text-sm px-0 font-sans gap-1",
            )}
          >
            Rumah dijual
            <span className="capitalize ">{b.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ForRentList = ({ navigations }: ForSaleListProps) => {
  const forRentBuildingTypes = new Map(
    navigations
      ?.sort((a, b) => a.building_type.localeCompare(b.building_type))
      .map((d) => [
        d.building_type,
        {
          label: d.building_type,
          value: `/disewa/${toSlug(d.building_type)}`,
        },
      ]),
  );
  const forRentHomeStreet = new Map(
    navigations
      ?.filter((b) => b.building_type === "rumah")
      .sort((a, b) => a.street.localeCompare(b.street))
      .map((d) => [
        d.street,
        {
          label: d.street,
          value: `/disewa/rumah/${toSlug(d.province)}/${toSlug(d.regency)}/${d.street}`,
        },
      ]),
  );
  const forRentApartmentStreet = new Map(
    navigations
      ?.filter((b) => b.building_type === "apartemen")
      .sort((a, b) => a.street.localeCompare(b.street))
      .map((d) => [
        d.street,
        {
          label: d.street,
          value: `/disewa/apartemen/${toSlug(d.province)}/${toSlug(d.regency)}/${d.street}`,
        },
      ]),
  );
  return (
    <div className="flex gap-16 h-fit overflow-y-hidden overflow-x-auto">
      <div className="flex flex-col">
        {Array.from(forRentBuildingTypes.values()).map((b) => (
          <Link
            key={b.label}
            title={b.label}
            href={`/properties/filter${b.value}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "justify-start capitalize text-sm px-0 font-sans ",
            )}
          >
            {b.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col flex-wrap max-h-72 gap-x-16">
        {Array.from(forRentHomeStreet.values()).map((b) => (
          <Link
            key={b.label}
            title={`Rumah disewa ${b.label}`}
            href={`/properties/filter${b.value}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "justify-start text-sm px-0 font-sans gap-1",
            )}
          >
            Rumah disewa
            <span className="capitalize ">{b.label}</span>
          </Link>
        ))}

        {Array.from(forRentApartmentStreet.values()).map((b) => (
          <Link
            key={b.label}
            title={`Apartemen disewa ${b.label}`}
            href={`/properties/filter${b.value}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "justify-start text-sm px-0 font-sans gap-1",
            )}
          >
            Apartemen disewa
            <span className="capitalize ">{b.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const FooterNavigation = () => {
  const nav = useQuery(findPropertyNavigationQueryOptions());
  const forSaleNav = nav?.data?.data?.filter(
    (b) => b.purchase_status === PropertyPurchaseStatus.ForSale,
  );

  const forRentNav = nav?.data?.data?.filter(
    (b) => b.purchase_status === PropertyPurchaseStatus.ForRent,
  );

  return (
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
        <ForSaleList navigations={forSaleNav} />
      </TabsContent>
      <TabsContent value="disewa" className="border-y border-primary px-4 mt-0">
        <ForRentList navigations={forRentNav} />
      </TabsContent>
    </Tabs>
  );
};

export const Footer = () => {
  const organizationSchema = createOrganizationSchema();
  return (
    <>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mt-16 bg-secondary border-t-2 border-t-primary">
        <footer className="container mx-auto p-4 flex flex-col gap-4">
          <SocialMedia />
          <FooterNavigation />
          <Organization />
        </footer>
      </div>
    </>
  );
};
