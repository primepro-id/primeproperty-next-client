'use client'
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
import { PropertyJoinAgent } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { findUniquePropertyJoinAgentQueryOptions } from "@/lib/hooks";
import Loading from "@/app/(client)/loading";

type DynamicPropertyProps = {
  propertyId: number;
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

export const DynamicProperty = ({ propertyId }: DynamicPropertyProps) => {
  const property = useQuery(findUniquePropertyJoinAgentQueryOptions(propertyId));
  if (property.isLoading) {
    return <Loading />
  }

  if (!property.data?.data) {
    return <PropertyNotFound searchParams={{}} />;
  }
  const dynamicJsonLd = createDynamicPropertySchema(property?.data?.data[0]);
  const placeLd = createPlaceSchema(property.data.data[0]);
  const relatedAreaLd = createRelatedAreaSchema(property.data.data[0]);
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
        <PropertyImages propertyWithAgent={property.data.data} />
        <div className="flex flex-col gap-4 lg:flex-row md:pt-4">
          <PropertyOverview property={property.data.data} />
          <MobileAgentCard property={property.data.data} />
          <DesktopAgentCard property={property.data.data} />
        </div>
        <div className="mt-16 flex flex-col gap-16">
          <RelatedProperties propertyId={propertyId} />
          <Faq defaultTab="PROPERTY" />
        </div>
      </div>
    </>
  );
};
