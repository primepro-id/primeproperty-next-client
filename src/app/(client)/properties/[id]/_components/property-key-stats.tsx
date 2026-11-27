import type { ReactNode } from "react";
import { LuBath, LuBedDouble, LuCar, LuHouse, LuRuler } from "react-icons/lu";
import type { Property } from "@/lib/types";
import { PropertyStatTile } from "./property-stat-tile";

type PropertyKeyStatsProps = {
  property: Property;
};

type KeyStat = {
  key: string;
  icon: ReactNode;
  value: number;
  unit?: string;
  label: string;
  desktopOnly?: boolean;
};

export const PropertyKeyStats = ({ property }: PropertyKeyStatsProps) => {
  const stats: KeyStat[] = [
    {
      key: "bedrooms",
      icon: <LuBedDouble />,
      value: property.specifications.bedrooms,
      label: "Kamar tidur",
    },
    {
      key: "bathrooms",
      icon: <LuBath />,
      value: property.specifications.bathrooms,
      label: "Kamar mandi",
    },
    {
      key: "land_area",
      icon: <LuRuler />,
      value: property.measurements.land_area,
      unit: "m²",
      label: "Luas tanah",
    },
    {
      key: "building_area",
      icon: <LuHouse />,
      value: property.measurements.building_area,
      unit: "m²",
      label: "Luas bangunan",
    },
    {
      key: "garage",
      icon: <LuCar />,
      value: property.specifications.garage,
      unit: "mobil",
      label: "Garasi",
      desktopOnly: true,
    },
  ];
  const visibleStats = stats.filter((stat) => stat.value > 0);

  if (visibleStats.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {visibleStats.map((stat) => (
        <PropertyStatTile
          key={stat.key}
          icon={stat.icon}
          value={stat.value.toLocaleString("id-ID")}
          unit={stat.unit}
          label={stat.label}
          className={stat.desktopOnly ? "hidden lg:flex" : undefined}
        />
      ))}
    </div>
  );
};
