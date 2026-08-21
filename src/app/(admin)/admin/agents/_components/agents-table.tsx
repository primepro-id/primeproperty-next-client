"use client";

import Loading from "@/app/(client)/loading";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { env } from "@/lib/env";
import { getAgentsQueryOptions } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { LuInstagram, LuPen } from "react-icons/lu";
import { DeleteAgentDialog } from "./delete-agent-dialog";

export const AgentsTable = () => {
  const agents = useQuery(getAgentsQueryOptions());
  if (agents.isLoading) {
    return <Loading />;
  }

  if (!agents.data) {
    return <>Server error, contact admin immediately</>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Name | Instagram</TableHead>
          <TableHead>Email | Phone</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.data.data?.data.map((a) => (
          <TableRow key={a.fullname}>
            <TableCell>
              <Image
                src={
                  a.profile_picture_url
                    ? env.NEXT_PUBLIC_S3_ENDPOINT + a.profile_picture_url
                    : "/images/primepro.png"
                }
                alt={a.fullname}
                width={100}
                height={100}
                className="size-8 rounded object-cover"
              />
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <p className="font-bold capitalize">{a.fullname}</p>
                <span className="flex items-center gap-1">
                  <LuInstagram /> {a.instagram ?? "N/A"}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <p>{a.email}</p>
                <p>{a.phone_number}</p>
              </div>
            </TableCell>
            <TableCell >
              <div className="flex items-center gap-4">
              <Link
                href={`/admin/agents/${a.id}`}
                className={cn(
                  buttonVariants({  size: "icon" }),
                )}
              >
                <LuPen />
              </Link>
              <DeleteAgentDialog agentId={a.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
