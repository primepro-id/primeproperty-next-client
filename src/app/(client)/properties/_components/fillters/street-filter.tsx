import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyNavigation } from "@/lib/types";
import { useMemo } from "react";

type StreetFilterProps = {
  regency?: string;
  onValueChange: (street: string) => void;
  defaultValue?: string;
  propertyNavigations?: PropertyNavigation[] | null;
};

export const StreetFilter = ({
  regency,
  defaultValue,
  propertyNavigations,
  onValueChange,
}: StreetFilterProps) => {
  const streets = useMemo(() => {
    if (regency) {
      return new Map(
        propertyNavigations
          ?.filter((nav) => nav.regency === regency)
          ?.map((nav) => [nav.street, nav.street]),
      );
    }
    return new Map(propertyNavigations?.map((nav) => [nav.street, nav.street]));
  }, [regency, propertyNavigations]);

  return (
    <div className="grid gap-2">
      <Label htmlFor="street">Jalan</Label>
      <Select
        name="street"
        defaultValue={defaultValue ? defaultValue : "-"}
        onValueChange={(val) => onValueChange(val === "-" ? "" : val)}
      >
        <SelectTrigger disabled={!regency} className="uppercase">
          <SelectValue
            placeholder={!regency ? "PILIH KABUPATEN" : "PILIH JALAN"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-">SEMUA JALAN</SelectItem>
          {Array.from(streets.values())?.map((street) => (
            <SelectItem
              key={street}
              value={street.toLowerCase()}
              className="uppercase"
            >
              {street}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
