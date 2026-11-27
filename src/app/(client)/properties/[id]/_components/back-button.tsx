"use client";

import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import { Button } from "@/components/ui/button";

type BackButtonProps = {
  className?: string;
};

export const BackButton = ({ className }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      type="button"
      size="icon-lg"
      variant="secondary"
      className={className}
      aria-label="Kembali"
      onClick={() => router.back()}
    >
      <LuArrowLeft />
    </Button>
  );
};
