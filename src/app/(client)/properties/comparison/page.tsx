import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { Faq } from "../_components/faq";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import Loading from "@/app/(client)/loading";
import { PropertyComparisonPageContent } from "./_components/property-comparison-page-content";

const seo = {
  title: "Perbandingkan Rumah dan Apartemen | PRIMEPRO INDONESIA",
  description:
    "Perbandingkan properti secara online mudah aman sekaligus cepat, hanya di PrimePro Indonesia",
  path: "/properties/comparison",
  index: false,
};
export const metadata: Metadata = createMetadata(seo);

type PageParams = {
  searchParams: Promise<{ ids?: string | string[] }>;
};

export default function Page({ searchParams }: PageParams) {
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

      <Suspense fallback={<Loading />}>
        <PropertyComparisonPageContent searchParams={searchParams} />
      </Suspense>
      <Faq defaultTab="PROPERTY" />
    </div>
  );
}
