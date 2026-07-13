import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type BannerProps = {
  className?: string;
};

export const Banner = ({ className }: BannerProps) => {
  return (
    <Link
      href="/properties/402"
      className={cn("relative w-full h-48 sm:h-64 md:h-80 lg:h-96", className)}
    >
      <Image
        src="/images/banner.jpeg"
        alt="Citra Homes Halim"
        fill
        className="object-contain"
        priority
      />
    </Link>
  );
};
