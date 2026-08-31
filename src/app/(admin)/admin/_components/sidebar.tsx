"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteAgentSessionCookies } from "@/lib/api/token";
import { removeAgentSession } from "@/lib/api/agents";
import { accessTokenQueryOptions } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import jwt from "jsonwebtoken";
import type { Agent } from "@/lib/types";
import {
  LuContact,
  LuHouse,
  LuLoader,
  LuLogOut,
  LuUser,
  LuUsers,
  LuWaves,
} from "react-icons/lu";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { runAgentLogout } from "../_lib/run-agent-logout";

type SidebarMenusProps = {
  open: boolean;
  pathname: string;
};

function SidebarMenus({ open, pathname }: SidebarMenusProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const leadsMenu = {
    icon: <LuContact />,
    title: "Leads",
    href: "/admin/leads",
  };
  const propertiesMenu = {
    icon: <LuHouse />,
    title: "Properties",
    href: "/admin/properties",
  };
  const profileMenu = {
    icon: <LuUser />,
    title: "Profile",
    href: `/admin/agents/${agent.id}`,
  };
  const menus =
    agent.role === "Admin"
      ? [
          propertiesMenu,
          leadsMenu,
          {
            icon: <LuUsers />,
            title: "Agents",
            href: "/admin/agents",
          },
          {
            icon: <LuWaves />,
            title: "Developers",
            href: "/admin/developers",
          },
          profileMenu,
        ]
      : agent.role === "Agent"
        ? [propertiesMenu, leadsMenu, profileMenu]
        : [];

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
        await runAgentLogout({
          supertokensUserId: agent?.supertokens_user_id ?? null,
          removeSession: removeAgentSession,
          deleteCookies: deleteAgentSessionCookies,
        });
    } catch (error) {
      console.error("Unable to remove the remote agent session.", error);
    } finally {
      window.location.replace("/auth");
    }
  }

  return (
    <>
      <SidebarContent>
        <SidebarMenu className="p-2">
          {menus.map((menu) => (
            <Link
              href={menu.href}
              title={menu.title}
              key={menu.title}
              className={cn(
                buttonVariants({
                  variant: pathname === menu.href ? "default" : "ghost",
                  size: open ? "default" : "icon",
                }),
                open && "justify-start",
                "w-full",
              )}
            >
              {menu.icon}
              {open && menu.title}
            </Link>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              tooltip="Logout"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer"
            >
              {isLoggingOut ? (
                <LuLoader className="animate-spin" />
              ) : (
                <LuLogOut />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
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
    </Sidebar>
  );
}
