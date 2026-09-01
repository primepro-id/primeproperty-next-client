import { Metadata } from "next";
import { Hero, History } from "./_components";
import { Services } from "./_components/services";
import { WhyUs } from "./_components/why-us";
import { ContactUs } from "./_components/contact-us";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Tentang PRIMEPRO INDONESIA",
  description:
    "Primepro Indonesia: Kantor properti spesialis dalam pemasaran properti residensial, komersial, dan investasi. ",
  path: "/about",
});

export default function About() {
  return (
    <div className="container mx-auto px-4 lg:px-0 py-16 max-w-5xl flex flex-col gap-12">
      <Hero />
      <History />
      <Services />
      <WhyUs />
      <ContactUs />
    </div>
  );
}
