import { PropertyOverview } from "./property-overview";
import { PropertyImages } from "./property-images";
import { PropertyNotFound } from "../../_components/not-found";
import { ShareLinks } from "./share-links";
import { RelatedProperties } from "../../_components";
import { Faq } from "../../_components/faq";
import { AgentCard } from "./agent-card";
import { MobileContactBar } from "./mobile-contact-bar";
import { MobileStickyHeader } from "./mobile-sticky-header";
import { PropertyPrice } from "./property-price";
import { PropertyToolbar } from "./property-toolbar";
import { PROPERTY_GALLERY_ID } from "../_lib/property-labels";
import { createDynamicPropertySchema } from "@/lib/schema/create-dynamic-property-schema";
import { createPlaceSchema } from "@/lib/schema/create-place-schema";
import { createRelatedAreaSchema } from "@/lib/schema/create-related-area-schema";
import type { PropertyJoinAgent } from "@/lib/types";

type DynamicPropertyProps = {
  propertyId: number;
  property: PropertyJoinAgent | null;
};

type JsonLdScriptProps = {
  data: object;
};

const JsonLdScript = ({ data }: JsonLdScriptProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
};

export const DynamicProperty = ({
  propertyId,
  property,
}: DynamicPropertyProps) => {
  if (!property) {
    return <PropertyNotFound searchParams={{}} />;
  }
  const listing = property[0];

  return (
    <div className="relative container mx-auto flex flex-col gap-4 px-2 pb-24 lg:py-4">
      <JsonLdScript data={createDynamicPropertySchema(listing)} />
      <JsonLdScript data={createPlaceSchema(listing)} />
      <JsonLdScript data={createRelatedAreaSchema(listing)} />

      <PropertyToolbar property={listing} />
      <PropertyImages id={PROPERTY_GALLERY_ID} propertyWithAgent={property} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
        <PropertyOverview property={property} />
        <aside className="sticky top-4 hidden h-fit flex-col gap-4 lg:flex">
          <AgentCard property={property} />
          <ShareLinks title={listing.title} property={property} />
        </aside>
      </div>

      <div className="mt-12 flex flex-col gap-16">
        <RelatedProperties propertyId={propertyId} regency={listing.regency} />
        <Faq defaultTab="PROPERTY" />
      </div>

      <MobileStickyHeader
        title={listing.title}
        price={<PropertyPrice property={listing} />}
        observedElementId={PROPERTY_GALLERY_ID}
      />
      <MobileContactBar property={property} />
    </div>
  );
};
