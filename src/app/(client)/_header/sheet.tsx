"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LogoLink } from "./logo-link";
import { useRef } from "react";
import { IoIosArrowForward, IoIosMenu } from "react-icons/io";
import Link from "next/link";
import ThemeButton from "./theme-button";
import { LuCopyright } from "react-icons/lu";

type SheetMenuProps = {
  onClick?: () => void;
};

const SheetMenu = ({ onClick }: SheetMenuProps) => {
  const MENU = [
    {
      title: "Properti",
      href: "/properties",
    },
    {
      title: "Agen",
      href: "/agents",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Lowongan",
      href: "/jobs",
    },
    {
      title: "Franchise",
      href: "/franchise",
    },
    {
      title: "Tentang",
      href: "/about",
    },
  ];
  return (
    <div className="flex flex-col border-y border-primary ">
      {MENU.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          title={item.title}
          className="px-4 py-3 flex items-center justify-between hover:bg-primary text-sm"
          onClick={onClick}
        >
          {item.title}
          <IoIosArrowForward />
        </Link>
      ))}
    </div>
  );
};

export const HeaderSheet = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeSheet = () => {
    closeRef.current?.click();
  };
  return (
    <Sheet>
      <SheetTrigger
        aria-label="PrimePro Menu"
        title="Menu"
        className={cn(
          buttonVariants({ size: "icon", variant: "ghost" }),
          "lg:hidden",
        )}
      >
        <IoIosMenu />
      </SheetTrigger>
      <SheetContent className="p-0" side="top">
        <SheetHeader className="flex-row items-center w-full justify-between space-y-0 px-2 py-1">
          <LogoLink onClickAction={closeSheet} />
          <SheetTitle className="text-base">PRIMEPRO INDONESIA</SheetTitle>
          <SheetClose
            ref={closeRef}
            className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
          >
            <IoIosMenu />
          </SheetClose>
        </SheetHeader>
        <SheetDescription />
        <SheetMenu onClick={closeSheet} />
        <SheetFooter className="flex-row items-center justify-between w-full px-2 py-1">
          <LuCopyright className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground flex items-center">
            PRIMEPRO INDONESIA {new Date().getFullYear()}
          </span>
          <ThemeButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
