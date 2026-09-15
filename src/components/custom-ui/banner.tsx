import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type BannerProps = {
  className?: string;
  variant?: "default" | "home";
  priority?: boolean;
};

export const Banner = ({
  className,
  variant = "default",
  priority = false,
}: BannerProps) => {
  return (
    <Link
      href="/properties/677"
      aria-label="Lihat Princess Cove, Malaysia"
      className={cn(
        "relative block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        variant === "home" ? "aspect-[2/1]" : "h-48 sm:h-64 md:h-80 lg:h-96",
        className,
      )}
    >
      <Image
        src="/images/banner.png"
        alt="Princess Cove Malaysia"
        fill
        priority={priority}
        sizes="100vw"
        className="object-contain"
      />
    </Link>
  );
};
