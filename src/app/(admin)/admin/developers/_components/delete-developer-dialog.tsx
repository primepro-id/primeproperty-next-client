import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteDeveloperMutationOptions, developerKeys } from "@/lib/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { LuLoader, LuTrash } from "react-icons/lu";
import { toast } from "react-toastify";

type DeleteDeveloperDialogProps = {
  developerId: number;
  developerName: string;
};

export const DeleteDeveloperDialog = ({
  developerId,
  developerName,
}: DeleteDeveloperDialogProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const deleteDeveloper = useMutation(
    deleteDeveloperMutationOptions({
      onSuccess: () => {
        toast.success("Developer deleted successfully");
        queryClient.invalidateQueries({
          queryKey: developerKeys.lists(),
        });
        closeRef.current?.click();
      },
      onError: (error) => {
        toast.error("Failed to delete developer, please try again later.");
        console.error(error);
      },
    }),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          aria-label={`Delete ${developerName}`}
        >
          <LuTrash />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogTitle className="font-semibold">
          Are you sure you want to delete {developerName}?
        </DialogTitle>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button
            className="w-full"
            onClick={() => deleteDeveloper.mutate(developerId)}
            disabled={deleteDeveloper.isPending}
          >
            {deleteDeveloper.isPending ? (
              <LuLoader className="animate-spin" />
            ) : (
              "Yes"
            )}
          </Button>
          <DialogClose asChild>
            <Button
              ref={closeRef}
              variant="outline"
              disabled={deleteDeveloper.isPending}
            >
              No
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
