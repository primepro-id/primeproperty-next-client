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

type RegencyFilterProps = {
  province?: string;
  onValueChange: (regency: string) => void;
  defaultValue?: string;
  propertyNavigations?: PropertyNavigation[] | null;
};

export const RegencyFilter = ({
  province,
  defaultValue,
  propertyNavigations,
  onValueChange,
}: RegencyFilterProps) => {
  const regencies = useMemo(() => {
    if (province) {
      return new Map(
        propertyNavigations
          ?.filter((nav) => nav.province === province)
          ?.map((nav) => [nav.regency, nav.regency]),
      );
    }
    return new Map(
      propertyNavigations?.map((nav) => [nav.regency, nav.regency]),
    );
  }, [province, propertyNavigations]);

  return (
    <div className="grid gap-2">
      <Label htmlFor="regency">Kabupaten</Label>
      <Select
        name="regency"
        defaultValue={defaultValue ? defaultValue : "-"}
        onValueChange={(val) => onValueChange(val === "-" ? "" : val)}
      >
        <SelectTrigger disabled={!province} className="uppercase">
          <SelectValue
            placeholder={!province ? "PILIH PROVINSI" : "PILIH KABUPATEN"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-">SEMUA KABUPATEN</SelectItem>
          {Array.from(regencies.values())?.map((regency) => (
            <SelectItem
              key={regency}
              value={regency.toLowerCase()}
              className="uppercase"
            >
              {regency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
