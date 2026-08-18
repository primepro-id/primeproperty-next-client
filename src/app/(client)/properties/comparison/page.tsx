import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { PropertyComparison } from "./_components/property-comparison";
import { Faq } from "../_components/faq";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const seo = {
  title: "Perbandingkan Rumah dan Apartemen | PRIMEPRO INDONESIA",
  description:
    "Perbandingkan properti secara online mudah aman sekaligus cepat, hanya di PrimePro Indonesia",
  keywords:
    "PrimePro Indonesia, Properti, Properti Prime, Properti Jakarta Selatan",
  path: "/properties/bookmark",
};
export const metadata: Metadata = createMetadata(seo);

type PageParams = {
  searchParams: Promise<{ ids: string }>;
};

export default async function Page({ searchParams }: PageParams) {
  const { ids } = await searchParams;
  return (
    <div className="w-full container mx-auto flex flex-col gap-4">
      <div className="p-2">
        <Link
          href="/properties/bookmark"
          className={buttonVariants({ variant: "outline" })}
        >
          <LuArrowLeft />
          Back to Saved
        </Link>
      </div>

      <PropertyComparison ids={ids} />
      <Faq defaultTab="PROPERTY" />
    </div>
  );
}
