import { env } from "@/lib/env";
import type { Agent } from "@/lib/types";

type AgentProfileSchemaInput = Pick<
  Agent,
  | "fullname"
  | "description"
  | "email"
  | "phone_number"
  | "instagram"
  | "profile_picture_url"
>;

export function createAgentProfileSchema(agent: AgentProfileSchemaInput) {
  const profileUrl = `${env.NEXT_PUBLIC_HOST_URL}/agents/${agent.fullname.replaceAll(" ", "-")}`;
  const personId = `${profileUrl}#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${profileUrl}#profile`,
        url: profileUrl,
        name: `${agent.fullname} - Agen Properti PrimePro Indonesia`,
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: agent.fullname,
        description: agent.description || undefined,
        email: agent.email,
        telephone: agent.phone_number,
        image: agent.profile_picture_url
          ? `${env.NEXT_PUBLIC_S3_ENDPOINT}${agent.profile_picture_url}`
          : undefined,
        worksFor: {
          "@type": "Organization",
          "@id": `${env.NEXT_PUBLIC_HOST_URL}/#organization`,
          name: "PrimePro Indonesia",
        },
        sameAs: agent.instagram
          ? [`https://www.instagram.com/${agent.instagram.replace(/^@/, "")}/`]
          : undefined,
        url: profileUrl,
      },
    ],
  };
}
