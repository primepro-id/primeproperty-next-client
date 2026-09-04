import { Metadata } from "next";
import { LuUsers } from "react-icons/lu";
import { Faq } from "../properties/_components/faq";
import { createMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import Loading from "@/app/(client)/loading";
import { AgentsContent } from "./_components/agents-content";

export const metadata: Metadata = createMetadata({
  title: "Agents - PRIMEPRO INDONESIA",
  description:
    "Temui agen properti PrimePro Indonesia yang siap membantu pencarian, pembelian, penjualan, dan penyewaan properti dengan layanan profesional tepercaya.",
  path: "/agents",
});

export default function JobPosting() {
  return (
    <div className="container mx-auto flex flex-col gap-8 p-4">
      <div className="flex flex-col">
        <div className="flex gap-2 items-center bg-primary text-primary-foreground rounded shadow p-1 w-fit text-xs mb-4">
          <LuUsers />
          Team Up!
        </div>
        <h1 className="text-3xl font-bold mb-2">Meet PrimePro Agents</h1>
        <h2 className="text-lg text-muted-foreground">
          Our diverse team of experts brings together decades of experience in
          real estate and property industries
        </h2>
      </div>
      <Suspense fallback={<Loading />}>
        <AgentsContent />
      </Suspense>

      <Faq defaultTab="PRIMEPRO" />
    </div>
  );
}
