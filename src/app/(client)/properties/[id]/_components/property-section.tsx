import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PropertySectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export const PropertySection = ({
  id,
  title,
  children,
  className,
}: PropertySectionProps) => {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        "flex scroll-mt-32 flex-col gap-3 lg:scroll-mt-16",
        className,
      )}
    >
      <h2 id={`${id}-heading`} className="font-sans text-lg font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
};
