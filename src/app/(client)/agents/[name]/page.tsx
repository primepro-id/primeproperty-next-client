import { createAgentMetadata } from "./_lib/create-agent-metadata";
import { Metadata } from "next";
import { AgentPage } from "./_components/agent";

type AgentPageProps = {
  params: Promise<{ name: string }>;
};

export const generateMetadata = async ({
  params,
}: AgentPageProps): Promise<Metadata> => createAgentMetadata(params);

export default async function Page({ params }: AgentPageProps) {
  const { name } = await params;
  return <AgentPage name={name} />
}
