"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyNavigation } from "@/lib/types";

type ProvinceFilterProps = {
  defaultValue?: string;
  propertyNavigations?: PropertyNavigation[] | null;
  onProvinceChange(province: string | undefined): void;
};

export const ProvinceFilter = ({
  defaultValue,
  propertyNavigations,
  onProvinceChange,
}: ProvinceFilterProps) => {
  const provinces = new Map(
    propertyNavigations?.map((nav) => [nav.province, nav.province]),
  );
  return (
    <div className="grid gap-2">
      <Label htmlFor="province">Provinsi</Label>
      <Select
        name="province"
        defaultValue={defaultValue}
        onValueChange={(val) => onProvinceChange(val === "-" ? "" : val)}
      >
        <SelectTrigger className="uppercase">
          <SelectValue placeholder="SEMUA PROVINSI" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-">SEMUA PROVINSI</SelectItem>
          {Array.from(provinces.values())?.map((province) => (
            <SelectItem
              key={province}
              value={province.toLowerCase()}
              className="uppercase"
            >
              {province}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
