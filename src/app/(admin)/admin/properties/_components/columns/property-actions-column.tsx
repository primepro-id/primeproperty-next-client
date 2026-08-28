import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { DeletePropertyDialog } from "../delete-property-dialog";

type PropertyActionsColumnProps = {
  propertyId: number;
  propertyTitle: string;
};

export function PropertyActionsColumn({
  propertyId,
  propertyTitle,
}: PropertyActionsColumnProps) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="icon" variant="outline">
        <Link
          href={`/admin/properties/${propertyId}`}
          title={`Edit property ${propertyId}`}
          aria-label={`Edit property ${propertyId}`}
        >
          <PencilIcon />
        </Link>
      </Button>
      <DeletePropertyDialog
        propertyId={propertyId}
        propertyTitle={propertyTitle}
      />
    </div>
  );
}
