import Link from "next/link";
import { AgentsTable } from "./_components/agents-table";
import { LuPlus } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AdminRouteGuard } from "../_components/admin-route-guard";

export default function Page() {
  return (
    <AdminRouteGuard>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">AGENTS</h1>
          <Link
            href="/admin/agents/new"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LuPlus />
            New Agent
          </Link>
        </div>

        <AgentsTable />
      </div>
    </AdminRouteGuard>
  );
}
