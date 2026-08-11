import { buttonVariants } from "@/components/ui/button";
import { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

export const AgentBreadcrumb = ({ agent }: { agent: Agent }) => {
  return (
    <div className="flex items-center ">
      <Link
        title="Primepro"
        href="/"
        className={cn(buttonVariants({ variant: "link" }), "pl-0")}
      >
        PRIMEPRO
      </Link>
      <LuChevronRight />
      <Link
        title="Agen"
        href="/agents"
        className={cn(buttonVariants({ variant: "link" }))}
      >
        AGEN
      </Link>
      <LuChevronRight />
      <Link
        title={agent.fullname}
        href={`/agents/${agent.fullname.replaceAll(" ", "-")}`}
        className={cn(buttonVariants({ variant: "link" }), "uppercase")}
      >
        {agent.fullname}
      </Link>
    </div>
  );
};
