import { Metadata } from "next";
import { AgentList } from "./_components/agent-list";
import { LuUsers } from "react-icons/lu";
import { Faq } from "../properties/_components/faq";

export const metadata: Metadata = {
  title: "Agents - PRIMEPRO INDONESIA",
  description:
    "PrimePro Indonesia sedang memperluas timnya dan mencari individu yang termotivasi tinggi untuk bergabung sebagai Marketing Executive.",
};

export default function JobPosting() {
  return (
    <div className="min-h-screen container mx-auto flex flex-col gap-8 p-4">
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
      <AgentList />

      <Faq defaultTab="PRIMEPRO" />
    </div>
  );
}
