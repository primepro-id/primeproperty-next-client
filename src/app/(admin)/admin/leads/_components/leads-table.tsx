"use client";

import Loading from "@/app/(client)/loading";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLeadsQueryOptions, accessTokenQueryOptions } from "@/lib/hooks";
import { formatDateToIndonesian } from "@/lib/intl/format-date-to-indonesian";
import type { Agent } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import jwt from "jsonwebtoken";
import { MdWhatsapp } from "react-icons/md";
import { createLeadWhatsappUrl } from "../_lib/create-lead-whatsapp-url";
import { getLeadsQueryForAgent } from "../_lib/get-leads-query";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LuHouse } from "react-icons/lu";

export const LeadsTable = () => {
  const accessToken = useQuery(accessTokenQueryOptions());
  const agent = accessToken.data
    ? (jwt.decode(accessToken.data) as Agent | null)
    : null;
  const leadQuery = getLeadsQueryForAgent(agent);
  const leads = useQuery(
    getLeadsQueryOptions(leadQuery ?? {}, {
      enabled: leadQuery !== null,
    }),
  );

  if (accessToken.isLoading || leads.isLoading) {
    return <Loading />;
  }

  if (accessToken.isError || !agent || leads.isError || !leads.data?.data) {
    return <>Server error, contact admin immediately</>;
  }

  const leadList = leads.data.data.data;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Leads ID</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Property ID</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {leadList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No leads found
            </TableCell>
          </TableRow>
        ) : (
          leadList.map((lead) => {
            const whatsappUrl = createLeadWhatsappUrl(lead);

            return (
              <TableRow key={lead.id}>
                <TableCell>{lead.id}</TableCell>
                <TableCell>
                  {formatDateToIndonesian(lead.created_at, true)}
                </TableCell>
                <TableCell className="font-bold capitalize">
                  {lead.name}
                </TableCell>
                <TableCell>{lead.phone_number}</TableCell>
                <TableCell>{lead.email ?? "N/A"}</TableCell>
                <TableCell>{lead.property_id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Link href={`/properties/${lead.property_id}`}
                      title="Lihat Properti"
                      target="_blank"
                      className={cn(buttonVariants({variant: "outline"}))}
                    >
                      <LuHouse />
                      Property
                    </Link>
                  {whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Chat with ${lead.name} on WhatsApp`}
                        className={cn(buttonVariants({variant: "outline"}))}
                      >
                        <MdWhatsapp data-icon="inline-start" />
                        Chat
                      </a>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      title="WhatsApp number unavailable"
                    >
                      <MdWhatsapp data-icon="inline-start" />
                      Chat
                    </Button>
                  )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
