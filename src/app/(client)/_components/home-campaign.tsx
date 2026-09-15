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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 pt-5">
        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Properti pilihan
          </p>
          <p className="font-sans text-[clamp(20px,2.2vw,28px)] leading-[1.2]">
            Princess Cove, Malaysia
          </p>
        </div>
        <Link
          href="/properties/677"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-primary bg-transparent text-primary hover:bg-primary hover:text-[#062338]",
          )}
        >
          Lihat Princess Cove <LuArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);
