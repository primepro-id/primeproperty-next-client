import { createAgentMetadata } from "./_lib/create-agent-metadata";
import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/(client)/loading";
import { AgentPageContent } from "./_components/agent-page-content";

type AgentPageProps = {
  params: Promise<{ name: string }>;
};

export const generateMetadata = async ({
  params,
}: AgentPageProps): Promise<Metadata> => createAgentMetadata(params);

export default function Page({ params }: AgentPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <AgentPageContent params={params} />
    </Suspense>
  );
}
