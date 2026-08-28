"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifiedViewerQueryOptions } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getAdminRouteAccessState } from "../_lib/admin-route-access";

type AdminRouteGuardProps = {
  children: ReactNode;
};

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const verifiedViewer = useQuery(verifiedViewerQueryOptions());
  const accessState = getAdminRouteAccessState(verifiedViewer.data ?? null, {
    isLoading: verifiedViewer.isLoading,
    isError: verifiedViewer.isError,
  });

  if (accessState === "loading") {
    return <p className="text-sm text-muted-foreground">Checking access...</p>;
  }

  if (accessState === "verification-error") {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Unable to verify access</CardTitle>
        </CardHeader>
        <CardContent>
          Sign in again before trying to access this page.
        </CardContent>
      </Card>
    );
  }

  if (accessState === "denied") {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Access denied</CardTitle>
        </CardHeader>
        <CardContent>
          You are not allowed to access this page. Administrator access is
          required.
        </CardContent>
      </Card>
    );
  }

  return children;
}
