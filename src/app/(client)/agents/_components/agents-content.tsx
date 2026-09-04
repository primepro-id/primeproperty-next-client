import { getAgents } from "@/lib/api";
import { AgentList } from "./agent-list";

export const AgentsContent = async () => {
  const agentsResponse = await getAgents();

  return (
    <div className="min-h-screen">
      <AgentList agents={agentsResponse.data?.data ?? []} />
    </div>
  );
};
