import { AdminRouteGuard } from "../../_components/admin-route-guard";
import { NewAgentFormCard } from "./_components/new-agent-form-card";

export default function Page() {
  return (
    <AdminRouteGuard>
      <NewAgentFormCard />
    </AdminRouteGuard>
  );
}
