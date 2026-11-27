import type { PropertyFacilities as PropertyFacility } from "@/lib/types";
import { PropertyFacilityChip } from "./property-facility-chip";

type PropertyFacilitiesProps = {
  facilities: PropertyFacility[];
};

const VISIBLE_FACILITY_COUNT = 6;

export const PropertyFacilities = ({ facilities }: PropertyFacilitiesProps) => {
  const visibleFacilities = facilities.slice(0, VISIBLE_FACILITY_COUNT);
  const hiddenFacilities = facilities.slice(VISIBLE_FACILITY_COUNT);

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-wrap gap-2">
        {visibleFacilities.map((facility, index) => (
          <PropertyFacilityChip
            key={`${index}-${facility.value}`}
            facility={facility}
          />
        ))}
      </ul>
      {hiddenFacilities.length > 0 && (
        <details className="group">
          <summary className="w-fit cursor-pointer list-none text-sm font-medium underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">
              +{hiddenFacilities.length} lainnya
            </span>
            <span className="hidden group-open:inline">Sembunyikan</span>
          </summary>
          <ul className="mt-2 flex flex-wrap gap-2">
            {hiddenFacilities.map((facility, index) => (
              <PropertyFacilityChip
                key={`${index}-${facility.value}-more`}
                facility={facility}
              />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};
