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
import { developersQueryOptions } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { LuPen } from "react-icons/lu";
import { DeleteDeveloperDialog } from "./delete-developer-dialog";

export const DevelopersTable = () => {
  const developers = useQuery(developersQueryOptions());

  if (developers.isLoading) return <Loading />;

  if (developers.isError || !developers.data) {
    return <>Server error, contact admin immediately</>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Name</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {developers.data.data?.data.map((developer) => (
          <TableRow key={developer.id}>
            <TableCell>
              <Image
                src={
                  developer.logo_path
                    ? env.NEXT_PUBLIC_S3_ENDPOINT + developer.logo_path
                    : "/images/primepro.png"
                }
                alt={developer.name}
                width={100}
                height={100}
                className="size-8 rounded object-contain"
              />
            </TableCell>
            <TableCell>
              <p className="font-bold capitalize">{developer.name}</p>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-4">
                <Link
                  href={`/admin/developers/${developer.id}`}
                  aria-label={`Edit ${developer.name}`}
                  className={cn(buttonVariants({ size: "icon" }))}
                >
                  <LuPen />
                </Link>
                <DeleteDeveloperDialog
                  developerId={developer.id}
                  developerName={developer.name}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
