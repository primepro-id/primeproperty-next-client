import { decodeAgentRouteName } from "@/lib/metadata/seo-domain";
import { AgentPage } from "./agent";

type AgentPageContentProps = {
  params: Promise<{ name: string }>;
};

export const AgentPageContent = async ({ params }: AgentPageContentProps) => {
  const { name } = await params;

  return <AgentPage name={decodeAgentRouteName(name)} />;
};
