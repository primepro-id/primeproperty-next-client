import type { FindLeadQuery } from "@/lib/api";
import type { Agent } from "@/lib/types";

type LeadViewer = Pick<Agent, "id" | "role">;

export function getLeadsQueryForAgent(
  agent: LeadViewer | null,
): FindLeadQuery | null {
  if (!agent) {
    return null;
  }

  if (agent.role === "Admin") {
    return {};
  }

  if (agent.role === "Agent") {
    return { agent_id: agent.id };
  }

  return null;
}
