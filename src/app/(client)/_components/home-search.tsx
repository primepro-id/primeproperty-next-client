import Link from "next/link";
import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";
import { Search } from "../properties/_components/fillters/search";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const HomeSearch = () => (
  <section
    className="grid gap-7 border-b border-primary py-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-20"
    aria-labelledby="home-title"
    id="website"
  >
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Image
          src="/images/primepro.png"
          alt="Logo PrimePro Indonesia"
          width={80}
          height={80}
          sizes="(min-width: 768px) 80px, 64px"
          className="size-16 shrink-0 object-contain md:size-20"
        />
        <p className="text-xs font-bold uppercase tracking-[0.12em]">
          PrimePro Indonesia
        </p>
      </div>
      <h1
        id="home-title"
        className="text-balance font-sans text-[clamp(30px,3.2vw,44px)] font-normal leading-[1.15]"
      >
        Temukan properti pilihan Anda
      </h1>
      <p className="mt-5 max-w-[560px] leading-[1.7] text-muted-foreground">
        PrimePro Indonesia adalah agen properti terpercaya di Jakarta yang memasarkan rumah, apartemen, tanah, dan properti komersial untuk dijual atau disewa. Temukan properti impianmu disini
      </p>
    </div>
    <div className="min-w-0 self-center rounded-lg bg-muted p-6">
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
