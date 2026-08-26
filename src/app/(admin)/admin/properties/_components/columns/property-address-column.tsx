import type { Property } from "@/lib/types";

type PropertyAddressColumnProps = {
  property: Pick<Property, "province" | "regency" | "street">;
};

export function PropertyAddressColumn({
  property,
}: PropertyAddressColumnProps) {
  return (
    <span className="min-w-64 capitalize">
      {[property.province, property.regency, property.street]
        .filter(Boolean)
        .join(", ")}
    </span>
  );
}
