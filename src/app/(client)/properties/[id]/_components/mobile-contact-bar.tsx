import type { PropertyJoinAgent } from "@/lib/types";
import { ContactAgentDialog } from "../../_components/contact-agent-dialog";
import { PropertyPrice } from "./property-price";

type MobileContactBarProps = {
  property: PropertyJoinAgent;
};

export const MobileContactBar = ({ property }: MobileContactBarProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t bg-background px-3 py-3 lg:hidden">
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-primary">
          <PropertyPrice property={property[0]} />
        </p>
        <p className="truncate text-sm capitalize text-muted-foreground">
          {property[1].fullname}
        </p>
      </div>
      <ContactAgentDialog
        isWhatsapp={false}
        iconOnly
        propertyWithAgent={property}
        className="size-10 shrink-0 border border-input bg-background text-foreground hover:bg-muted"
      />
      <ContactAgentDialog
        isWhatsapp
        propertyWithAgent={property}
        className="h-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
      />
    </div>
  );
};
