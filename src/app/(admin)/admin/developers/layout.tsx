import type { ReactNode } from "react";
import { AdminRouteGuard } from "../_components/admin-route-guard";

type DevelopersLayoutProps = {
  children: ReactNode;
};

export default function DevelopersLayout({ children }: DevelopersLayoutProps) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>;
}
