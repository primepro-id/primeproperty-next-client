"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { propertyKeys, removePropertyMutationOptions } from "@/lib/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type DeletePropertyDialogProps = {
  propertyId: number;
  propertyTitle: string;
};

export function DeletePropertyDialog({
  propertyId,
  propertyTitle,
}: DeletePropertyDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const removeProperty = useMutation(removePropertyMutationOptions());

  const handleDelete = async () => {
    try {
      const response = await removeProperty.mutateAsync(propertyId);
      if (response.status < 200 || response.status >= 300 || !response.data) {
        toast.error(response.message || "Property could not be deleted.");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: propertyKeys.all });
      toast.success("Property deleted successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Property could not be deleted. Try again.");
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!removeProperty.isPending) setOpen(nextOpen);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="destructive"
          title={`Delete property ${propertyId}`}
          aria-label={`Delete property ${propertyId}`}
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete property?</AlertDialogTitle>
          <AlertDialogDescription>
            “{propertyTitle}” will be removed from the property catalog. This
            action cannot be undone from this page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={removeProperty.isPending}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={removeProperty.isPending}
            onClick={handleDelete}
          >
            {removeProperty.isPending ? (
              <LoaderCircleIcon
                data-icon="inline-start"
                className="animate-spin"
              />
            ) : (
              <Trash2Icon data-icon="inline-start" />
            )}
            {removeProperty.isPending ? "Deleting..." : "Delete property"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
