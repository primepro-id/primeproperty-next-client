"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createDeveloperMutationOptions,
  developerKeys,
  uploadS3ImagesMutationOptions,
} from "@/lib/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { DeveloperForm } from "../../_components/developer-form";

export const NewDeveloperFormCard = () => {
  const queryClient = useQueryClient();
  const uploadLogo = useMutation(uploadS3ImagesMutationOptions());
  const createDeveloper = useMutation(createDeveloperMutationOptions());
  const isLoading = uploadLogo.isPending || createDeveloper.isPending;

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>New Developer</CardTitle>
      </CardHeader>
      <CardContent>
        <DeveloperForm
          isLoading={isLoading}
          onSubmit={async (data) => {
            try {
              const logo = data.logo_path?.[0];
              if (!logo) {
                toast.error("A logo is required");
                return false;
              }

              const upload = await uploadLogo.mutateAsync([logo]);
              const logoPath = upload.data?.[0]?.path;
              if (!logoPath) {
                toast.error("Fail to upload logo, please try again");
                return false;
              }

              const createdDeveloper = await createDeveloper.mutateAsync({
                name: data.name,
                logo_path: logoPath,
              });
              if (!createdDeveloper.data) {
                toast.error("Fail to create developer, please try again");
                return false;
              }

              await queryClient.invalidateQueries({
                queryKey: developerKeys.all,
              });
              toast.success("Developer created successfully");
              return true;
            } catch (error) {
              console.error(error);
              toast.error(
                "Fail to create developer, contact admin immediately",
              );
              return false;
            }
          }}
        />
      </CardContent>
    </Card>
  );
};
