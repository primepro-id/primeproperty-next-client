import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteAgentMutationOptions, getAgentsQueryOptions } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { LuLoader, LuTrash } from "react-icons/lu";
import { toast } from "react-toastify";

type DeleteAgentDialogProps = {
  agentId: string;
};

export const DeleteAgentDialog = ({ agentId }: DeleteAgentDialogProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const deleteAgent = useMutation(
    deleteAgentMutationOptions({
      onSuccess: () => {
        toast.success("Agent deleted successfully");
        queryClient.invalidateQueries({
          queryKey: getAgentsQueryOptions().queryKey,
        });
        closeRef.current?.click();
      },
      onError: (error) => {
        toast.error("Failed to delete agent, please try again later.");
        console.error(error);
      },
    }),
  );
  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "destructive", size: "icon" }))}
      >
        <LuTrash />
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogTitle className="font-semibold">
          Are you sure you want to delete this agent?
        </DialogTitle>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            className="w-full"
            onClick={() => deleteAgent.mutate(agentId)}
            disabled={deleteAgent.isPending}
          >
            {deleteAgent.isPending ? (
              <LuLoader className="animate-spin" />
            ) : (
              "Yes"
            )}
          </Button>
          <DialogClose
            ref={closeRef}
            className={cn(buttonVariants({ variant: "outline" }))}
            disabled={deleteAgent.isPending}
          >
            No
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
