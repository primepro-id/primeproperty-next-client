import { buttonVariants } from "@/components/ui/button";
import { createOrganizationSchema } from "@/lib/schema";
import type { PropertyNavigation } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  LuFacebook,
  LuInstagram,
  LuLinkedin,
  LuMail,
  LuPhone,
  LuYoutube,
} from "react-icons/lu";
import { MdOutlineLocationOn } from "react-icons/md";
import { FooterNavigation } from "./footer-navigation";

const Organization = () => {
  return (
    <div
      id="organization"
      className="flex flex-col md:flex-row gap-4 md:gap-12"
    >
      <div className="flex items-center gap-4">
        <LuMail />
        <p>primeproagent@gmail.com</p>
      </div>
      <div className="flex items-center gap-4">
        <LuPhone />
        <p>+62-821-1616-2995</p>
      </div>
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <MdOutlineLocationOn />
        </div>
        <div className="lg:flex gap-1">
          <p>Jl Pakubuwono VI No. 35,</p>
          <p>Kebayoran Baru,</p>
          <p>Jakarta Selatan, 12120</p>
        </div>
      </div>
    </div>
  );
};

const SocialMedia = () => {
  const socials = [
    {
      title: "Facebook Primepro Indonesia",
      href: "https://www.facebook.com/share/1BHTU7HvZx/",
      icon: <LuFacebook />,
    },
    {
      title: "Instagram Primepro Indonesia",
      href: "https://www.instagram.com/primepro_id/",
      icon: <LuInstagram />,
    },
    {
      title: "Linkedin Primepro Indonesia",
      href: "https://www.linkedin.com/company/primepro-indonesia/",
      icon: <LuLinkedin />,
    },
    {
      title: "Youtube Primepro Indonesia",
      href: "https://www.youtube.com/@primeproindonesia",
      icon: <LuYoutube />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="/images/primepro.png"
          alt="PrimePro Indonesia"
          width={25}
          height={25}
          id="logo"
        />
        <p className="text-xl font-bold">PRIMEPRO INDONESIA</p>
      </div>
      <div className="flex items-center gap-4">
        {socials.map((social) => (
          <Link
            key={social.title}
            title={social.title}
            href={social.href}
            className={cn(buttonVariants({ size: "icon" }))}
          >
            {social.icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

type FooterProps = {
  navigations: PropertyNavigation[];
};

export const Footer = ({ navigations }: FooterProps) => {
  const organizationSchema = createOrganizationSchema();

  return (
    <>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mt-16 bg-secondary border-t-2 border-t-primary">
        <footer className="container mx-auto p-4 flex flex-col gap-4">
          <SocialMedia />
          <FooterNavigation navigations={navigations} />
          <Organization />
        </footer>
      </div>
    </>
  );
};
