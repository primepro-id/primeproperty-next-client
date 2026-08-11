'use client'

import { findPropertyJoinAgentQueryOptions, getAgentByFullnameQueryOptions } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { AgentBreadcrumb } from "./agent-breadcrumb";
import { AgentBio } from "./agent-bio";
import Loading from "@/app/(client)/loading";
import { PropertyList } from "@/app/(client)/properties/_components/list";
import { Faq } from "@/app/(client)/properties/_components/faq";

type AgentPageProps = {
  name: string
}

export const AgentPage = ({name}: AgentPageProps) => {

  const agent = useQuery(getAgentByFullnameQueryOptions(name))
  const agentWithProperties = useQuery(findPropertyJoinAgentQueryOptions({agent_id: agent?.data?.data?.id}, {enabled: !!agent?.data?.data}));

  if (agent.isLoading || agentWithProperties.isLoading) {
    return <Loading />
  }

  if (!agent.data?.data || !agentWithProperties?.data) {
    return <></>
  }


  return (
    <div className="flex flex-col gap-8 container mx-auto p-4">
      <AgentBreadcrumb agent={agent?.data?.data} />
      <AgentBio
        agent={agent?.data?.data}
        propertiesWithAgent={agentWithProperties.data.data.data}
      />
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Property List</h2>
        <PropertyList
          searchParams={{}}
          propertiesWithAgent={agentWithProperties.data.data.data}
        />
      </div>

      <Faq defaultTab="PRIMEPRO" />
    </div>
  );
}
