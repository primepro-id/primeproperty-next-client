import { PropertyOverview } from "./property-overview";
import { PropertyImages } from "./property-images";
import { PropertyNotFound } from "../../_components/not-found";
import { ShareLinks } from "./share-links";
import { ContactAgentDialog } from "../../_components/contact-agent-dialog";
import { AgentAvatar } from "./agent-avatar";
import { RelatedSearch } from "./related-search";
import { RelatedProperties } from "../../_components";
import { Faq } from "../../_components/faq";
import { createDynamicPropertySchema } from "@/lib/schema/create-dynamic-property-schema";
import { createPlaceSchema } from "@/lib/schema/create-place-schema";
import { createRelatedAreaSchema } from "@/lib/schema/create-related-area-schema";
import type { PropertyJoinAgent } from "@/lib/types";

type DynamicPropertyProps = {
  propertyId: number;
  property: PropertyJoinAgent | null;
};

type AgentCardProps = {
  property: PropertyJoinAgent;
};

const MobileAgentCard = ({ property }: AgentCardProps) => {
  return (
    <>
      <AgentAvatar property={property} className="lg:hidden" />
      <div className="grid grid-cols-2 gap-4 sticky bottom-0 w-full py-4 border-t bg-background lg:hidden ">
        <ContactAgentDialog isWhatsapp={false} propertyWithAgent={property} />
        <ContactAgentDialog isWhatsapp={true} propertyWithAgent={property} />
      </div>
      <div className="flex flex-col gap-4 mb-16">
        <RelatedSearch property={property[0]} className="lg:hidden" />
        <ShareLinks
          title={property[0].title}
          property={property}
          className="lg:hidden"
        />
      </div>
    </>
  );
};

const DesktopAgentCard = ({ property }: AgentCardProps) => {
  return (
    <div className="hidden lg:flex flex-col gap-4 sticky top-4 h-fit w-96">
      <div className="border rounded p-4 flex flex-col gap-4">
        <AgentAvatar property={property} />
        <div className="grid grid-cols-2 gap-4 w-full border-t pt-4">
          <ContactAgentDialog isWhatsapp={false} propertyWithAgent={property} />
          <ContactAgentDialog isWhatsapp={true} propertyWithAgent={property} />
        </div>
      </div>
      <RelatedSearch property={property[0]} />
      <ShareLinks title={property[0].title} property={property} />
    </div>
  );
};

export const DynamicProperty = ({
  propertyId,
  property,
}: DynamicPropertyProps) => {
  if (!property) {
    return <PropertyNotFound searchParams={{}} />;
  }
  const dynamicJsonLd = createDynamicPropertySchema(property[0]);
  const placeLd = createPlaceSchema(property[0]);
  const relatedAreaLd = createRelatedAreaSchema(property[0]);
  return (
    <>
      <div className="relative container mx-auto px-2 py-4 flex flex-col gap-2 lg:gap-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dynamicJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(placeLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(relatedAreaLd).replace(/</g, "\\u003c"),
          }}
        />
        <PropertyImages propertyWithAgent={property} />
        <div className="flex flex-col gap-4 lg:flex-row md:pt-4">
          <PropertyOverview property={property} />
          <MobileAgentCard property={property} />
          <DesktopAgentCard property={property} />
        </div>
        <div className="mt-16 flex flex-col gap-16">
          <RelatedProperties
            propertyId={propertyId}
            regency={property[0].regency}
          />
          <Faq defaultTab="PROPERTY" />
        </div>
      </div>
    </>
  );
};
