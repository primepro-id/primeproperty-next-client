export type VerifiedViewer = {
  id: string;
  role: "Admin" | "Agent";
};

export function extractVerifiedViewer(value: unknown): VerifiedViewer | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const claims = value as Record<string, unknown>;
  if (typeof claims.id !== "string" || claims.id.length === 0) {
    return null;
  }

  if (claims.role !== "Admin" && claims.role !== "Agent") {
    return null;
  }

  return {
    id: claims.id,
    role: claims.role,
  };
}
