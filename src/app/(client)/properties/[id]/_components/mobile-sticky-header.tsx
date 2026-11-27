"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BackButton } from "./back-button";
import { PropertyShareButton } from "./property-share-button";

type MobileStickyHeaderProps = {
  title: string;
  price: ReactNode;
  observedElementId: string;
};

export const MobileStickyHeader = ({
  title,
  price,
  observedElementId,
}: MobileStickyHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observedElement = document.getElementById(observedElementId);
    if (!observedElement) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(!entry.isIntersecting);
    });
    observer.observe(observedElement);
    return () => observer.disconnect();
  }, [observedElementId]);

  return (
    <div
      aria-hidden={!isVisible}
      inert={!isVisible}
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-2 transition-transform lg:hidden",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <BackButton className="shrink-0 bg-transparent" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-sm font-bold text-primary">{price}</p>
      </div>
      <PropertyShareButton title={title} className="shrink-0 bg-transparent" />
    </div>
  );
};
