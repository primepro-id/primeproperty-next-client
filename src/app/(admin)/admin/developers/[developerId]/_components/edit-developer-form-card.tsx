"use client";

import Loading from "@/app/(client)/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";
import {
  developerByIdQueryOptions,
  developerKeys,
  updateDeveloperMutationOptions,
  uploadS3ImagesMutationOptions,
} from "@/lib/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { DeveloperForm } from "../../_components/developer-form";
import { buildDeveloperUpdateData } from "../../_lib/build-developer-update-data";

type EditDeveloperFormCardProps = {
  developerId: string;
};

export const EditDeveloperFormCard = ({
  developerId,
}: EditDeveloperFormCardProps) => {
  const queryClient = useQueryClient();
  const developer = useQuery(developerByIdQueryOptions(developerId));
  const uploadLogo = useMutation(uploadS3ImagesMutationOptions());
  const updateDeveloper = useMutation(updateDeveloperMutationOptions());

  if (developer.isPending) return <Loading />;

  if (developer.isError || !developer.data?.data) {
    return (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Edit Developer</CardTitle>
        </CardHeader>
        <CardContent>
          Unable to load this developer. Please try again later.
        </CardContent>
      </Card>
    );
  }

  const developerData = developer.data.data;
  const existingLogoUrl = developerData.logo_path
    ? env.NEXT_PUBLIC_S3_ENDPOINT + developerData.logo_path
    : undefined;
  const isLoading = uploadLogo.isPending || updateDeveloper.isPending;

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Edit Developer</CardTitle>
      </CardHeader>
      <CardContent>
        <DeveloperForm
          mode="edit"
          isLoading={isLoading}
          existingLogoUrl={existingLogoUrl}
          initialValues={{ name: developerData.name }}
          onSubmit={async (data) => {
            try {
              const logo = data.logo_path?.[0];
              let uploadedLogoPath: string | undefined;

              if (logo) {
                const upload = await uploadLogo.mutateAsync([logo]);
                uploadedLogoPath = upload.data?.[0]?.path;

                if (!uploadedLogoPath) {
                  toast.error("Fail to upload logo, please try again");
                  return false;
                }
              }

              const updatedDeveloper = await updateDeveloper.mutateAsync({
                id: developerId,
                payload: buildDeveloperUpdateData(
                  data,
                  developerData.logo_path,
                  uploadedLogoPath,
                ),
              });

              if (!updatedDeveloper.data) {
                toast.error("Fail to update developer, please try again");
                return false;
              }

              await queryClient.invalidateQueries({
                queryKey: developerKeys.all,
              });
              toast.success("Developer updated successfully");
              return true;
            } catch (error) {
              console.error(error);
              toast.error(
                "Fail to update developer, contact admin immediately",
              );
              return false;
            }
          }}
        />
      </CardContent>
    </Card>
  );
};
