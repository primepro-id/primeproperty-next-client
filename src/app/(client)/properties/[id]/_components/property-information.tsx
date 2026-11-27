import { PROPERTY_FURNITURE_CAPACITY, type Property } from "@/lib/types";
import { getBuildingConditionLabel } from "../_lib/property-labels";

type PropertyInformationProps = {
  property: Property;
};

type SpecificationItem = {
  label: string;
  value: string | null;
};

export const PropertyInformation = ({ property }: PropertyInformationProps) => {
  const { specifications, measurements } = property;
  const items: SpecificationItem[] = [
    { label: "Tipe properti", value: property.building_type },
    {
      label: "Sertifikat",
      value: property.building_certificate
        ? property.building_certificate.toUpperCase()
        : null,
    },
    { label: "Kondisi", value: getBuildingConditionLabel(property) },
    {
      label: "Tinggi bangunan",
      value:
        measurements.building_level > 0
          ? `${measurements.building_level} lantai`
          : null,
    },
    {
      label: "Garasi",
      value: specifications.garage > 0 ? `${specifications.garage} mobil` : null,
    },
    {
      label: "Carport",
      value:
        specifications.carport > 0 ? `${specifications.carport} mobil` : null,
    },
    {
      label: "Daya listrik",
      value:
        specifications.electrical_power > 0
          ? `${specifications.electrical_power.toLocaleString("id-ID")} Watt`
          : null,
    },
    {
      label: "Perabotan",
      value: property.building_furniture_capacity
        ? PROPERTY_FURNITURE_CAPACITY[property.building_furniture_capacity]
        : null,
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
      {items
        .filter((item) => item.value)
        .map((item) => (
          <div key={item.label} className="flex flex-col border-b pb-2">
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="capitalize">{item.value}</dd>
          </div>
        ))}
    </dl>
  );
};
