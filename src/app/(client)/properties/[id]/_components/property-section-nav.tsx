import { cn } from "@/lib/utils";

export type PropertySectionLink = {
  id: string;
  label: string;
};

type PropertySectionNavProps = {
  links: PropertySectionLink[];
  className?: string;
};

export const PropertySectionNav = ({
  links,
  className,
}: PropertySectionNavProps) => {
  if (links.length < 2) {
    return null;
  }

  return (
    <nav
      aria-label="Bagian halaman properti"
      className={cn(
        "sticky top-14 z-30 -mx-2 border-b bg-background px-2 lg:top-0 lg:mx-0 lg:px-0",
        className,
      )}
    >
      <ul className="flex gap-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className="block border-b-2 border-transparent py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
