"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { accessTokenQueryOptions } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import jwt from "jsonwebtoken";
import { Agent } from "@/lib/types";
import { LuUser, LuUsers } from "react-icons/lu";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";

type SidebarMenusProps = {
  open: boolean;
  pathname: string;
};

function SidebarMenus({ open, pathname }: SidebarMenusProps) {
  const accessToken = useQuery(accessTokenQueryOptions());
  const agent = accessToken.data
    ? (jwt.decode(accessToken.data) as Agent)
    : null;

  if (accessToken.isLoading || !agent) {
    return (
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Skeleton className="w-full h-4 bg-sidebar-accent" />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Skeleton className="w-full h-4 bg-sidebar-accent" />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Skeleton className="w-full h-4 bg-sidebar-accent" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    );
  }

  if (agent.role === "Admin") {
    const ADMIN_MENUS = [
      {
        icon: <LuUsers />,
        title: "Agents",
        href: "/admin/agents",
      },
    ];
    return (
      <SidebarContent>
        <SidebarMenu className="p-2">
          {ADMIN_MENUS.map((m) => (
            <Link
              href={m.href}
              title={m.title}
              key={m.title}
              className={cn(
                buttonVariants({
                  variant: pathname === m.href ? "default" : "ghost",
                  size: open ? "default" : "icon",
                }),
                open && "justify-start",
                " w-full",
              )}
            >
              {m.icon}
              {open && m.title}
            </Link>
          ))}
        </SidebarMenu>
      </SidebarContent>
    );
  }

  return <SidebarContent></SidebarContent>;
}

export function AdminSidebar() {
  const { open, openMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={cn(
          "border-b items-center justify-between",
          (open || openMobile) && "flex-row",
        )}
      >
        <Link href="/admin" className="flex items-center gap-4">
          <Image
            src="/images/primepro.png"
            alt="PRIMEPRO INDONESIA"
            width={100}
            height={100}
            className="size-6"
          />
        </Link>

        <SidebarTrigger />
      </SidebarHeader>
      <SidebarMenus open={open || openMobile} pathname={pathname} />
      {/*<SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />*/}
    </Sidebar>
  );
}
