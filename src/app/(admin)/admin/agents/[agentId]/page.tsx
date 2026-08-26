import { EditAgentFormCard } from "./_components/edit-agent-form-card";

type EditAgentPageProps = {
  params: Promise<{ agentId: string }>;
};

export default async function Page({ params }: EditAgentPageProps) {
  const { agentId } = await params;

  return <EditAgentFormCard agentId={agentId} />;
}
