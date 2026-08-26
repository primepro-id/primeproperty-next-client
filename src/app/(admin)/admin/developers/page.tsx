import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import { DevelopersTable } from "./_components/developers-table";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold">DEVELOPERS</h1>
        <Link
          href="/admin/developers/new"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <LuPlus />
          New Developer
        </Link>
      </div>

      <DevelopersTable />
    </div>
  );
}
