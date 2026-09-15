import Link from "next/link";
import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";
import { Search } from "../properties/_components/fillters/search";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const HomeSearch = () => (
  <section
    className="grid gap-4 border-b border-primary py-6 lg:grid-cols-[1.15fr_1fr] lg:gap-x-16 lg:py-8"
    aria-labelledby="home-title"
    id="website"
  >
    <div className="lg:col-start-1 lg:row-start-1">
      <div className="flex items-center gap-4">
        <Image
          src="/images/primepro.png"
          alt="Logo PrimePro Indonesia"
          width={80}
          height={80}
          sizes="(min-width: 768px) 80px, 48px"
          className="size-12 shrink-0 object-contain md:size-20"
        />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em]">
            PrimePro Indonesia
          </p>
          <h1
            id="home-title"
            className="min-w-0 text-balance font-sans text-2xl font-normal leading-tight md:text-3xl xl:text-4xl"
          >
            Temukan properti pilihan Anda
          </h1>
        </div>
      </div>
    </div>
    <p className="order-last max-w-[560px] leading-[1.7] text-muted-foreground lg:order-none lg:col-start-1 lg:row-start-2">
      PrimePro Indonesia adalah agen properti terpercaya di Jakarta yang
      memasarkan rumah, apartemen, tanah, dan properti komersial untuk dijual
      atau disewa. Temukan properti impianmu disini
    </p>
    <div className="min-w-0 self-center rounded-lg bg-muted p-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:p-6">
      <label htmlFor="property-search" className="mb-3 block text-sm font-bold">
        Mulai dari lokasi atau tipe properti
      </label>
      <Search />
      <Link
        href="/properties"
        className={cn(
          buttonVariants(),
          "mt-3 w-full bg-[#225B83] text-white hover:bg-[#062338]",
        )}
      >
        Lihat semua properti <LuArrowRight aria-hidden="true" />
      </Link>
    </div>
  </section>
);
