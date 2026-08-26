"use client";

import Loading from "@/app/(client)/loading";
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {leadList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No leads found
            </TableCell>
          </TableRow>
        ) : (
          leadList.map((lead) => (
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
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
