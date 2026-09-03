import { PropertyJoinAgent } from "@/lib/types";
import { env } from "@/lib/env";
import { createAgentPath } from "@/lib/metadata/seo-domain";
import { formatDateToIndonesian } from "@/lib/intl/format-date-to-indonesian";
import Image from "next/image";
import Link from "next/link";
import { LuCircleUser } from "react-icons/lu";
import { ContactAgentDialog } from "./contact-agent-dialog";

export const PropertyAgentInfo = ({
  propertyWithAgent,
}: {
  propertyWithAgent: PropertyJoinAgent;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <Link
        title={propertyWithAgent[1].fullname}
        aria-label={propertyWithAgent[1].fullname}
        href={createAgentPath(propertyWithAgent[1])}
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      >
        <div className="w-8 h-8">
          {propertyWithAgent[1].profile_picture_url ? (
            <Image
              src={
                env.NEXT_PUBLIC_S3_ENDPOINT +
                propertyWithAgent[1].profile_picture_url
              }
              alt={propertyWithAgent[1].fullname}
              width={100}
              height={100}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <LuCircleUser className="w-full h-full text-muted-foreground/50" />
          )}
        </div>
        <div className="flex flex-col font-sans ">
          <span className="text-xs text-muted-foreground">
            Diperbarui {formatDateToIndonesian(propertyWithAgent[0].updated_at)}
          </span>
          <span className="text-sm capitalize">
            {propertyWithAgent[1].fullname}
          </span>
        </div>
      </Link>
      <ContactAgentDialog
        isWhatsapp={true}
        propertyWithAgent={propertyWithAgent}
      />
    </div>
  );
};
