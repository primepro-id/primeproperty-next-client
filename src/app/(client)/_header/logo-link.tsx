"use client";
import Link from "next/link";
import Image from "next/image";

type LogoLinkProps = {
  onClickAction?: () => void;
};

export const LogoLink = ({ onClickAction }: LogoLinkProps) => {
  return (
    <Link
      href="/"
      title="PrimePro Indonesia"
      aria-label="PrimePro Indonesia"
      className="flex items-center gap-1"
      onClick={onClickAction}
    >
      <Image
        src="/images/primepro.png"
        alt="PrimePro Indonesia"
        width={75}
        height={75}
        className="size-8 lg:size-6"
      />
    </Link>
  );
};
