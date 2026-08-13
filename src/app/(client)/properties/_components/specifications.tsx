import { PropertyJoinAgent } from "@/lib/types";
import { LuBath, LuBedDouble, LuCar } from "react-icons/lu";

type PropertyCardProps = {
  propertyWithAgent: PropertyJoinAgent;
};

export const Specifications = ({ propertyWithAgent }: PropertyCardProps) => {
  return (
    <div className="flex items-center gap-2 bg-primary/10 text-muted-foreground px-1 rounded w-fit">
      {propertyWithAgent[0].specifications.bedrooms > 0 && (
        <span className="flex items-center gap-1 ">
          <LuBedDouble />
          <div>{propertyWithAgent[0].specifications.bedrooms}</div>
        </span>
      )}
      {propertyWithAgent[0].specifications.bathrooms > 0 && (
        <span className="flex items-center gap-1">
          <LuBath />
          <div>{propertyWithAgent[0].specifications.bathrooms}</div>
        </span>
      )}
      {(propertyWithAgent[0].specifications.garage > 0 ||
        propertyWithAgent[0].specifications.carport > 0) && (
        <span className="flex items-center gap-1">
          <LuCar />
          <div>
            {propertyWithAgent[0].specifications.garage +
              propertyWithAgent[0].specifications.carport}
          </div>
        </span>
      )}
      {propertyWithAgent[0].measurements.land_area > 0 && (
        <span className="flex items-center gap-1">
          <div>LT:</div>
          <div>{propertyWithAgent[0].measurements.land_area} m²</div>
        </span>
      )}
      {propertyWithAgent[0].measurements.building_area > 0 && (
        <span className="flex items-center gap-1">
          <div>LB:</div>
          <div>{propertyWithAgent[0].measurements.building_area} m²</div>
        </span>
      )}
    </div>
  );
};
