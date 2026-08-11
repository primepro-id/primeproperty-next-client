import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyPurchaseStatus } from "@/lib/types";

type PurchaseStatusFilterProps = {
  defaultValue?: PropertyPurchaseStatus;
  onValueChange: (status: string) => void;
};

export const PurchaseStatusFilter = ({
  defaultValue,
  onValueChange,
}: PurchaseStatusFilterProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="purchase_status">Dijual/Disewa</Label>
      <Select
        name="purchase_status"
        defaultValue={defaultValue}
        onValueChange={(val) => onValueChange(val === "-" ? "" : val)}
      >
        <SelectTrigger className="uppercase">
          <SelectValue placeholder="SEMUA" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-">SEMUA</SelectItem>
          <SelectItem value={PropertyPurchaseStatus.ForSale}>DIJUAL</SelectItem>
          <SelectItem value={PropertyPurchaseStatus.ForRent}>DISEWA</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
