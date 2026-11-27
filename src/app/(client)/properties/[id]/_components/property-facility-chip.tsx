import { FACILITY_ICON } from "@/lib/types/facilities";
import type { PropertyFacilities } from "@/lib/types";

type PropertyFacilityChipProps = {
  facility: PropertyFacilities;
};

export const PropertyFacilityChip = ({
  facility,
}: PropertyFacilityChipProps) => {
  const icon = FACILITY_ICON[facility.value as keyof typeof FACILITY_ICON];

  return (
    <li className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm capitalize">
      {icon && (
        <span className="text-muted-foreground" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{facility.indonesian_label}</span>
    </li>
  );
};
