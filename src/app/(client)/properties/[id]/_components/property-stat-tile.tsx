import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PropertyStatTileProps = {
  icon: ReactNode;
  value: string;
  unit?: string;
  label: string;
  className?: string;
};

export const PropertyStatTile = ({
  icon,
  value,
  unit,
  label,
  className,
}: PropertyStatTileProps) => {
  return (
    <div
      className={cn("flex items-center gap-3 rounded-lg bg-muted p-3", className)}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/25 text-lg text-amber-800 dark:text-primary"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-base font-medium leading-tight">
          {value}
          {unit && (
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </p>
        <p className="truncate text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};
