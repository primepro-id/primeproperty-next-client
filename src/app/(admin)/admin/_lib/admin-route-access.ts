type AdminRouteViewer = {
  role?: string;
} | null;

type AdminRouteQueryState = {
  isLoading: boolean;
  isError: boolean;
};

export type AdminRouteAccessState =
  | "loading"
  | "verification-error"
  | "denied"
  | "allowed";

export function getAdminRouteAccessState(
  viewer: AdminRouteViewer,
  queryState: AdminRouteQueryState,
): AdminRouteAccessState {
  if (queryState.isLoading) {
    return "loading";
  }

  if (queryState.isError || !viewer) {
    return "verification-error";
  }

  return viewer.role === "Admin" ? "allowed" : "denied";
}
