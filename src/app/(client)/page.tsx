import Link from "next/link";
import { PopularProperties } from "./properties/_components";
import { LuHouse } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { Search } from "./properties/_components/fillters/search";
import { Faq } from "./properties/_components/faq";
import { createWebsiteSchema } from "@/lib/schema";
import Script from "next/script";
import { findManyDevelopers } from "@/lib/api/developers";
import { env } from "@/lib/env";
import { Banner } from "@/components/custom-ui/banner";

export const revalidate = 0;

const Hero = () => {
  const websiteSchema = createWebsiteSchema();
  return (
    <>
      <Script
        id="website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex flex-col gap-4 pt-16 lg:pb-16 " id="website">
        <Image
          src="/images/primepro.png"
          alt="PRIMEPRO INDONESIA"
          width={576}
          height={576}
          className="object-cover aspect-square size-48 mx-auto"
        />
        <h1 className="text-center font-bold lg:text-2xl">
          Your Private Key to Exceptional Properties
        </h1>
        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-primary w-full max-w-lg mx-auto">
            <Search />
          </div>
          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-fit mx-auto",
            )}
          >
            <LuHouse />
            Lihat Semua
          </Link>
        </div>
      </div>
    </>
  );
};

const Partners = async () => {
  const developers = await findManyDevelopers();
  const BANKS = [
    "/images/banks/bca.png",
    "/images/banks/bni.png",
    "/images/banks/bri.png",
    "/images/banks/bsi.png",
    "/images/banks/mandiri.webp",
    "/images/banks/cimb.png",
    "/images/banks/ocbc.png",
    "/images/banks/panin.png",
    "/images/banks/permata.png",
    "/images/banks/danamon.webp",
    "/images/banks/maybank.png",
    "/images/banks/smbc.png",
  ];

  return (
    <div className="flex flex-col gap-4 ">
      <h3 className="text-3xl font-bold text-center font-sans">PARTNERS</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {BANKS.map((bank, index) => (
          <Image
            key={`partner_${index}`}
            src={bank}
            alt={bank}
            width={576}
            height={576}
            className="w-full  object-contain aspect-square rounded dark:bg-white dark:p-1"
          />
        ))}
        {developers?.data?.data.map((dev) => (
          <Image
            key={dev.name}
            src={env.NEXT_PUBLIC_S3_ENDPOINT + dev.logo_path}
            alt={dev.name}
            width={576}
            height={576}
            className="w-full object-contain aspect-square rounded dark:bg-white dark:p-1"
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-b from-primary via-transparent to-transparent px-4">
        <Hero />
      </div>
      <div className="container mx-auto flex flex-col gap-40 px-4">
        <Banner className="lg:hidden" />
        <PopularProperties />
        <Partners />
        <Faq defaultTab="PRIMEPRO" />
      </div>
    </div>
  );
};

export default HomePage;
