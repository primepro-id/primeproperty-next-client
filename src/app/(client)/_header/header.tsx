"use client";
import Link from "next/link";
import { LogoLink } from "./logo-link";
import { HeaderSheet } from "./sheet";
import { Navigation } from "./navigation";
import ThemeButton from "./theme-button";

export const Header = () => {
  return (
    <div className="bg-primary/50">
      <div className="flex items-center justify-between container mx-auto p-2 ">
        <div className="flex items-center justify-between lg:gap-2 w-full lg:w-fit">
          <LogoLink />
          <Link
            href="/"
            className="text-center font-bold text-2xl lg:text-base"
          >
            PRIMEPRO INDONESIA
          </Link>
          <HeaderSheet />
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <Navigation />
          <ThemeButton />
        </div>
      </div>
    </div>
  );
};
