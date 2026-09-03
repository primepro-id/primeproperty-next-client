import { findPropertyJoinAgent, getAgentByFullname } from "@/lib/api";
import { AgentBreadcrumb } from "./agent-breadcrumb";
import { AgentBio } from "./agent-bio";
import { PropertyList } from "@/app/(client)/properties/_components/list";
import { Faq } from "@/app/(client)/properties/_components/faq";
import { createAgentProfileSchema } from "@/lib/schema/create-agent-profile-schema";

type AgentPageProps = {
  name: string;
};

export const AgentPage = async ({ name }: AgentPageProps) => {
  const agentResponse = await getAgentByFullname(name);
  const agent = agentResponse.data;
  if (!agent) {
    return <></>;
  }
  const propertiesResponse = await findPropertyJoinAgent({
    agent_id: agent.id,
  });
  const propertyData = propertiesResponse.data?.data;
  if (!propertyData) return <></>;

  const agentProfileSchema = createAgentProfileSchema(agent);

  return (
    <>
      <script
        id="agent-profile-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(agentProfileSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex flex-col gap-8 container mx-auto p-4">
        <AgentBreadcrumb agent={agent} />
        <AgentBio agent={agent} propertiesWithAgent={propertyData} />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Property List</h2>
          <PropertyList searchParams={{}} propertiesWithAgent={propertyData} />
        </div>

        <Faq defaultTab="PRIMEPRO" />
      </div>
    </>
  );
};
