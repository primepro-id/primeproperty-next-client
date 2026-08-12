import Link from "next/link";
import Image from "next/image";
import { LuCircleUser } from "react-icons/lu";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { PropertyJoinAgent } from "@/lib/types";

type AgentAvatarProps = {
  property: PropertyJoinAgent;
  className?: string;
};

export const AgentAvatar = ({ property, className }: AgentAvatarProps) => {
  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <div className="w-10 h-10">
        {property[1].profile_picture_url ? (
          <Image
            src={env.NEXT_PUBLIC_S3_ENDPOINT + property[1].profile_picture_url}
            alt={property[1].fullname}
            title={`Agen properti ${property[1].fullname}`}
            width={100}
            height={100}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <LuCircleUser className="w-full h-full text-muted-foreground/50" />
        )}
      </div>
      <Link
        title={property[1].fullname}
        aria-label={property[1].fullname}
        href={`/agents/${property[1].fullname.replaceAll(" ", "-")}`}
        className="flex flex-col hover:underline hover:underline-offset-4"
      >
        <span className="capitalize font-sans">{property[1].fullname}</span>
        <span className="text-muted-foreground">AGEN PRIMEPRO INDONESIA</span>
      </Link>
    </div>
  );
};
