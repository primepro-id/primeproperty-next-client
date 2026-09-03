import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import {
  PropertyComparison,
  PropertyComparisonFallback,
} from "./_components/property-comparison";
import { Faq } from "../_components/faq";
import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { findUniquePropertyJoinAgent } from "@/lib/api";
import { parsePropertyComparisonIds } from "../_lib/parse-property-route-ids";

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

export default async function Page({ searchParams }: PageParams) {
  const { ids } = await searchParams;
  const propertyIds = parsePropertyComparisonIds(ids);
  if (!propertyIds) {
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
        <PropertyComparisonFallback />
        <Faq defaultTab="PROPERTY" />
      </div>
    );
  }

  const [firstId, secondId] = propertyIds;
  const [firstProperty, secondProperty] = await Promise.all([
    findUniquePropertyJoinAgent(firstId),
    findUniquePropertyJoinAgent(secondId),
  ]);
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

      <PropertyComparison
        ids={propertyIds}
        firstProperty={firstProperty.data}
        secondProperty={secondProperty.data}
      />
      <Faq defaultTab="PROPERTY" />
    </div>
  );
}
