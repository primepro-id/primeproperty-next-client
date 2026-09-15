import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { Banner } from "@/components/custom-ui/banner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const HomeCampaign = () => (
  <section
    aria-label="Princess Cove, Malaysia"
    className="bg-[#062338] text-white"
  >
    <Banner variant="home" priority />
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="flex h-20 items-center justify-between gap-3">
        <div>
          <p className="mb-1 hidden text-xs font-bold uppercase tracking-[0.12em] text-primary sm:block">
            Properti pilihan
          </p>
          <p className="font-sans text-sm leading-tight sm:text-xl lg:text-2xl">
            Princess Cove, Malaysia
          </p>
        </div>
        <Link
          href="/properties/677"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shrink-0 border-primary bg-transparent px-3 text-xs text-primary hover:bg-primary hover:text-[#062338] sm:px-4 sm:text-sm",
          )}
        >
          Lihat Princess Cove <LuArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);
