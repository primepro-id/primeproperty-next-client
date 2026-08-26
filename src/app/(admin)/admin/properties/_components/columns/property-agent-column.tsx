import { env } from "@/lib/env";
import type { Agent } from "@/lib/types";
import Image from "next/image";

type PropertyAgentColumnProps = {
  agent: Agent;
};

export function PropertyAgentColumn({ agent }: PropertyAgentColumnProps) {
  const profilePicture = agent.profile_picture_url
    ? env.NEXT_PUBLIC_S3_ENDPOINT + agent.profile_picture_url
    : "/images/primepro.png";

  return (
    <div className="flex min-w-56 items-center gap-3">
      <Image
        src={profilePicture}
        alt={agent.fullname}
        width={100}
        height={100}
        className="size-10 rounded object-cover"
      />
      <div className="flex flex-col gap-1">
        <span className="font-medium capitalize">{agent.fullname}</span>
        <span className="text-muted-foreground">{agent.phone_number}</span>
      </div>
    </div>
  );
}
