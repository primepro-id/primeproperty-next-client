import type { FindPropertyQuery } from "@/lib/api";
import type { Agent } from "@/lib/types";

type PropertyViewer = Pick<Agent, "id" | "role">;

export function getPropertiesQueryForViewer(
  viewer: PropertyViewer | null,
  query: FindPropertyQuery,
): FindPropertyQuery | null {
  if (!viewer) {
    return null;
  }

  if (viewer.role === "Admin") {
    const adminQuery = { ...query };
    delete adminQuery.agent_id;
    return adminQuery;
  }

  if (viewer.role === "Agent") {
    return { ...query, agent_id: viewer.id };
  }

  return null;
}
