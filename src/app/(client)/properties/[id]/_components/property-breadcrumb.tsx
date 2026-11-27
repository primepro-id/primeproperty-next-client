import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createPropertyBreadcrumbSegments } from "@/lib/metadata/seo-domain";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

type PropertyBreadcrumbProps = {
  property: Property;
  className?: string;
};

export const PropertyBreadcrumb = ({
  property,
  className,
}: PropertyBreadcrumbProps) => {
  const segments = createPropertyBreadcrumbSegments(property.site_path);

  return (
    <Breadcrumb className={cn("min-w-0", className)}>
      <BreadcrumbList className="flex-nowrap overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:gap-2">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/properties">Properti</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment) => (
          <Fragment key={segment.path}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={segment.path}>{segment.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="block max-w-48 truncate sm:max-w-80">
            {property.title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
