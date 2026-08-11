import { getAgentByFullname } from "@/lib/api";
import { env } from "@/lib/env";
import { toTitleCase } from "@/lib/to-title-case";
import { Metadata } from "next";

export const createAgentMetadata = async (
  params: Promise<{
    name: string;
  }>,
): Promise<Metadata> => {
  const { name } = await params;
  const agent = await getAgentByFullname(name)
  if (agent.data) {
    return {
      title:
        toTitleCase(agent.data?.fullname ?? "") +
        "- Agen Properti PRIMEPRO INDONESIA",
      description:
        agent.data?.description ||
        `Agen properti ${agent.data?.fullname} dari Primepro Indonesia.`,
      twitter: {
        title: agent.data?.fullname,
        site: "@primeproindonesia",
        creator: "@primeproindonesia",
        card: "summary_large_image",
        images: [
          `${env.NEXT_PUBLIC_HOST_URL}${agent.data?.profile_picture_url}`,
        ],
      },
      openGraph: {
        title: agent.data?.fullname,
        description: agent.data?.description || "",
        siteName: "Primepro Indonesia",
        locale: "id_ID",
      },
      appleWebApp: true,
      applicationName: "Primepro Indonesia",
      alternates: {
        canonical: `${env.NEXT_PUBLIC_HOST_URL}/agents/${agent.data?.fullname.replaceAll(" ", "-")}`,
      },
      robots: "index, follow",
    };

  }
  return {}
};
