"use client";

import Loading from "@/app/(client)/loading";
import { Button } from "@/components/ui/button";
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
          <TableHead>ID</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>WhatsApp</TableHead>
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
                <TableCell>
                  {whatsappUrl ? (
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Chat with ${lead.name} on WhatsApp`}
                      >
                        <MdWhatsapp data-icon="inline-start" />
                        Chat
                      </a>
                    </Button>
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
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
