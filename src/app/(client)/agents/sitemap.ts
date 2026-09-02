import { getAgents } from "@/lib/api";
import { env } from "@/lib/env";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const agents = await getAgents();
  return [
    {
      url: env.NEXT_PUBLIC_HOST_URL + `/agents`,
    },
    ...(agents.data?.data.map((agent) => {
      return {
        url:
          env.NEXT_PUBLIC_HOST_URL +
          `/agents/${agent.fullname.replaceAll(" ", "-")}`,
        lastModified: new Date(agent.updated_at),
      };
    }) ?? []),
  ];
}
