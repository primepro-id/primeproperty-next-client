"use client";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

import { LuCopy, LuFacebook } from "react-icons/lu";
import { BsTelegram, BsTwitterX } from "react-icons/bs";
import { usePathname } from "next/navigation";
import { env } from "@/lib/env";
import { MdWhatsapp } from "react-icons/md";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { PropertyJoinAgent } from "@/lib/types";

type ShareLinksProps = {
  title: string;
  property: PropertyJoinAgent;
  className?: string;
};

export const ShareLinks = ({ title, property, className }: ShareLinksProps) => {
  const whatsappUrl = useMemo(() => {
    const linkUrl = "https://api.whatsapp.com/send?text=";
    const text = `*${property[0].title}*\nLokasi: ${property[0].street},${property[0].regency}\n\nContact:\n${property[1].instagram ? `https://instagram.com/${property[1].instagram}` : ""}\nWhatsapp:\nwa.me/62${property[1].phone_number}\nLink:\n${env.NEXT_PUBLIC_HOST_URL}/properties/${property[0].id}`;
    return linkUrl + text;
  }, [property]);
  const pathname = usePathname();
  const url = env.NEXT_PUBLIC_HOST_URL + pathname;
  const caption = `Cek properti "${title}" menarik dengan harga terbaik! Bisa langsung tanya penjual juga di sini\n`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${caption}`;
  const twitterUrl = `https://x.com/intent/tweet?url=${url}&text=${caption}`;
  const telegramUrl = `https://t.me/share/url?url=${url}&text=${caption}`;
  return (
    <div className={cn("flex items-center gap-4 mx-auto", className)}>
      <Link
        href={facebookUrl}
        target="_blank"
        className={buttonVariants({ size: "icon", variant: "outline" })}
        data-tooltip-id="fb-share"
        data-tooltip-content="Share to Facebook"
        data-tooltip-place="bottom"
        title={caption}
        aria-label={caption}
      >
        <LuFacebook />
      </Link>
      <Tooltip id="fb-share" />
      <Link
        href={telegramUrl}
        target="_blank"
        className={buttonVariants({ size: "icon", variant: "outline" })}
        data-tooltip-id="tele-share"
        data-tooltip-content="Share to Telegram"
        data-tooltip-place="bottom"
        title={caption}
        aria-label={caption}
      >
        <BsTelegram />
      </Link>
      <Tooltip id="tele-share" />
      <Link
        href={encodeURI(whatsappUrl)}
        target="_blank"
        className={buttonVariants({ size: "icon", variant: "outline" })}
        data-tooltip-id="whatsapp-share"
        data-tooltip-content="Share to WhatsApp"
        data-tooltip-place="bottom"
        title={caption}
        aria-label={caption}
      >
        <MdWhatsapp />
      </Link>
      <Tooltip id="whatsapp-share" />
      <Link
        href={twitterUrl}
        target="_blank"
        className={buttonVariants({ size: "icon", variant: "outline" })}
        data-tooltip-id="twitter-share"
        data-tooltip-content="Share to Twitter"
        data-tooltip-place="bottom"
        title={caption}
        aria-label={caption}
      >
        <BsTwitterX />
      </Link>
      <Tooltip id="twitter-share" />
      <Button
        onClick={() => {
          navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard");
        }}
        size="icon"
        variant="outline"
        data-tooltip-id="copy-share"
        data-tooltip-content="Copy Link"
        data-tooltip-place="bottom"
        title={caption}
      >
        <LuCopy />
      </Button>
      <Tooltip id="copy-share" />
    </div>
  );
};
