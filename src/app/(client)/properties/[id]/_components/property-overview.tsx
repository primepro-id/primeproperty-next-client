import type { PropertyJoinAgent } from "@/lib/types";
import { PROPERTY_SECTION_IDS } from "../_lib/property-labels";
import { AgentAvatar } from "./agent-avatar";
import { ExpandableText } from "./expandable-text";
import { PropertyFacilities } from "./property-facilities";
import { PropertyHeader } from "./property-header";
import { PropertyInformation } from "./property-information";
import { PropertyKeyStats } from "./property-key-stats";
import { PropertyLocation } from "./property-location";
import { PropertySection } from "./property-section";
import {
  PropertySectionNav,
  type PropertySectionLink,
} from "./property-section-nav";
import { PropertySummary } from "./property-summary";
import { RelatedSearch } from "./related-search";
import { ShareLinks } from "./share-links";
import { GoogleTranslateElement } from "@/components/custom-ui/google-translate-element";

type PropertyOverviewProps = {
  property: PropertyJoinAgent;
};

export const PropertyOverview = ({ property }: PropertyOverviewProps) => {
  const listing = property[0];
  const hasDescription = listing.description.trim().length > 0;
  const hasFacilities = listing.facilities.length > 0;
  const hasLocation = Boolean(listing.gmap_iframe);

  const optionalSectionLinks: (PropertySectionLink | null)[] = [
    hasDescription
      ? { id: PROPERTY_SECTION_IDS.description, label: "Deskripsi" }
      : null,
    { id: PROPERTY_SECTION_IDS.specifications, label: "Spesifikasi" },
    hasFacilities
      ? { id: PROPERTY_SECTION_IDS.facilities, label: "Fasilitas" }
      : null,
    hasLocation ? { id: PROPERTY_SECTION_IDS.location, label: "Lokasi" } : null,
  ];
  const sectionLinks = optionalSectionLinks.filter(
    (link): link is PropertySectionLink => link !== null,
  );

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col">
        <GoogleTranslateElement />
        <div className="flex flex-col gap-4">
          <PropertyHeader property={listing} />
          <PropertyKeyStats property={listing} />
          <PropertySummary property={listing} />
          <AgentAvatar
            property={property}
            className="border-y py-3 lg:hidden"
          />
        </div>
      </div>

      <PropertySectionNav links={sectionLinks} />

      {hasDescription && (
        <PropertySection
          id={PROPERTY_SECTION_IDS.description}
          title="Deskripsi"
        >
          <ExpandableText text={listing.description} />
        </PropertySection>
      )}

      <PropertySection
        id={PROPERTY_SECTION_IDS.specifications}
        title="Spesifikasi"
      >
        <PropertyInformation property={listing} />
      </PropertySection>

      {hasFacilities && (
        <PropertySection id={PROPERTY_SECTION_IDS.facilities} title="Fasilitas">
          <PropertyFacilities facilities={listing.facilities} />
        </PropertySection>
      )}

      {listing.gmap_iframe && (
        <PropertySection
          id={PROPERTY_SECTION_IDS.location}
          title="Perkiraan lokasi"
        >
          <PropertyLocation
            title={listing.title}
            gmapIframe={listing.gmap_iframe}
          />
        </PropertySection>
      )}

      <RelatedSearch property={listing} />
      <ShareLinks
        title={listing.title}
        property={property}
        className="mx-0 lg:hidden"
      />
    </div>
  );
};
