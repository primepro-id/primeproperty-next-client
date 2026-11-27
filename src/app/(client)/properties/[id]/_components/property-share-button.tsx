"use client";

import { LuShare2 } from "react-icons/lu";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

type PropertyShareButtonProps = {
  title: string;
  className?: string;
};

export const PropertyShareButton = ({
  title,
  className,
}: PropertyShareButtonProps) => {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link disalin");
  };

  return (
    <Button
      type="button"
      size="icon-lg"
      variant="secondary"
      className={className}
      aria-label="Bagikan properti"
      onClick={handleShare}
    >
      <LuShare2 />
    </Button>
  );
};
