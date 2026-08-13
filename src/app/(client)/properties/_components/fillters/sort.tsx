import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FindQuerySort } from "@/lib/api";

type FilterSortProps = {
  defaultValue?: FindQuerySort;
  onValueChange: (value: FindQuerySort | "Newest") => void;
};

export const FilterSort = ({
  defaultValue,
  onValueChange,
}: FilterSortProps) => {
  return (
    <div>
      <Label>Urutkan</Label>
      <Select
        name="order_by"
        defaultValue={defaultValue ?? "Newest"}
        onValueChange={(value) =>
          onValueChange(value as FindQuerySort | "Newest")
        }
      >
        <SelectTrigger className="uppercase">
          <SelectValue placeholder="Terbaru" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Newest">TERBARU</SelectItem>
          <SelectItem value="LowestPrice">HARGA TERENDAH</SelectItem>
          <SelectItem value="HighestPrice">HARGA TERTINGGI</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
