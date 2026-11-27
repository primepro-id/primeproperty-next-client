import type { PropertyJoinAgent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ContactAgentDialog } from "../../_components/contact-agent-dialog";
import { AgentAvatar } from "./agent-avatar";

type AgentCardProps = {
  property: PropertyJoinAgent;
  className?: string;
};

export const AgentCard = ({ property, className }: AgentCardProps) => {
  return (
    <div className={cn("flex flex-col gap-4 rounded-lg border p-4", className)}>
      <AgentAvatar property={property} />
      <div className="flex flex-col gap-2">
        <ContactAgentDialog
          isWhatsapp
          propertyWithAgent={property}
          className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        />
        <ContactAgentDialog
          isWhatsapp={false}
          propertyWithAgent={property}
          className="h-10 w-full border border-input bg-background text-foreground hover:bg-muted"
        />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        ID properti #{property[0].id}
      </p>
    </div>
  );
};
