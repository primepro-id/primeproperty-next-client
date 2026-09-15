import { cn } from "@/lib/utils";
import Image, { getImageProps } from "next/image";
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
  const mobileImage =
    variant === "home"
      ? getImageProps({
          src: "/images/banner_mobile.png",
          alt: "Princess Cove Malaysia",
          width: 1774,
          height: 887,
          sizes: "100vw",
        }).props
      : undefined;

  const desktopImage = (
    <Image
      src="/images/banner.png"
      alt="Princess Cove Malaysia"
      fill
      priority={variant === "home" ? false : priority}
      loading={variant === "home" && priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      sizes="100vw"
      className="object-contain"
    />
  );
  return (
    <Link
      href="/properties/677"
      aria-label="Lihat Princess Cove, Malaysia"
      className={cn(
        "relative block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        variant === "home"
          ? "h-[min(50vw,calc(55svh-5rem))] md:h-[min(33.333333vw,calc(55svh-5rem))]"
          : "h-48 sm:h-64 md:h-80 lg:h-96",
        className,
      )}
    >
      {mobileImage ? (
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={mobileImage.srcSet}
            sizes={mobileImage.sizes}
          />
          {desktopImage}
        </picture>
      ) : (
        desktopImage
      )}
    </Link>
  );
};
