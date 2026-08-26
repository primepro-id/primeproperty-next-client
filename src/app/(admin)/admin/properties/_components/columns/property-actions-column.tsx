import { Button } from "@/components/ui/button";
import { LuPen, LuTrash2 } from "react-icons/lu";

type PropertyActionsColumnProps = {
  propertyId: number;
};

export function PropertyActionsColumn({
  propertyId,
}: PropertyActionsColumnProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="icon"
        variant="outline"
        title={`Edit property ${propertyId}`}
        aria-label={`Edit property ${propertyId}`}
      >
        <LuPen data-icon="inline-start" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="destructive"
        title={`Delete property ${propertyId}`}
        aria-label={`Delete property ${propertyId}`}
      >
        <LuTrash2 data-icon="inline-start" />
      </Button>
    </div>
  );
}
