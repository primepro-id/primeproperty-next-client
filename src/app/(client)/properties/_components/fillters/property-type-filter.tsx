import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyNavigation } from "@/lib/types";

type PropertyTypeFilterProps = {
  defaultValue?: string;
  propertyNavigations?: PropertyNavigation[] | null;
  onValueChange: (propType: string) => void;
};

export const PropertyTypeFilter = ({
  defaultValue,
  propertyNavigations,
  onValueChange,
}: PropertyTypeFilterProps) => {
  const buildingTypes = new Map(
    propertyNavigations?.map((nav) => [nav.building_type, nav.building_type]),
  );
  return (
    <div className="grid gap-2">
      <Label htmlFor="building_type">Tipe Bangunan</Label>
      <Select
        name="building_type"
        defaultValue={defaultValue}
        onValueChange={(val) => onValueChange(val === "-" ? "" : val)}
      >
        <SelectTrigger className="uppercase">
          <SelectValue placeholder="SEMUA PROPERTI" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-">SEMUA PROPERTI</SelectItem>
          {Array.from(buildingTypes.values()).map((building, index) => (
            <SelectItem
              key={`${index}_${building}`}
              value={building}
              className="uppercase"
            >
              {building}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
