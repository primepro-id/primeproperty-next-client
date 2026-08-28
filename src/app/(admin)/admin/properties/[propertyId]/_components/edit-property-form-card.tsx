"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UpdatePropertyPayload } from "@/lib/api/properties";
import {
  accessTokenQueryOptions,
  findUniquePropertyJoinAgentQueryOptions,
  propertyKeys,
  updatePropertyMutationOptions,
  uploadS3ImagesMutationOptions,
} from "@/lib/hooks";
import { AgentRole, type Agent } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwt from "jsonwebtoken";
import { toast } from "react-toastify";
import { PropertyForm } from "../../_components/property-form/property-form";
import {
  buildPropertyPayload,
  mergeUploadedPropertyImages,
} from "../../_lib/property-form-domain";

type EditPropertyFormCardProps = {
  propertyId: string;
};

function isSuccessfulStatus(status: number) {
  return status >= 200 && status < 300;
}

export function EditPropertyFormCard({
  propertyId,
}: EditPropertyFormCardProps) {
  const numericPropertyId = Number(propertyId);
  const validPropertyId =
    Number.isInteger(numericPropertyId) && numericPropertyId > 0;
  const queryClient = useQueryClient();
  const accessToken = useQuery(accessTokenQueryOptions());
  const property = useQuery(
    findUniquePropertyJoinAgentQueryOptions(numericPropertyId, {
      enabled: validPropertyId,
    }),
  );
  const uploadImages = useMutation(uploadS3ImagesMutationOptions());
  const updateProperty = useMutation(updatePropertyMutationOptions());
  const viewer = accessToken.data
    ? (jwt.decode(accessToken.data) as Agent | null)
    : null;

  if (!validPropertyId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit property</CardTitle>
        </CardHeader>
        <CardContent>The property ID is invalid.</CardContent>
      </Card>
    );
  }

  if (accessToken.isLoading || property.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading property...</p>;
  }

  const propertyWithAgent = property.data?.data;
  if (
    accessToken.isError ||
    property.isError ||
    !viewer ||
    !propertyWithAgent ||
    propertyWithAgent[0].is_deleted
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit property</CardTitle>
        </CardHeader>
        <CardContent>
          This property could not be loaded. It may have been removed.
        </CardContent>
      </Card>
    );
  }

  const [propertyData, assignedAgent] = propertyWithAgent;
  const canEdit =
    viewer.role === AgentRole.Admin || assignedAgent.id === viewer.id;
  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit property</CardTitle>
        </CardHeader>
        <CardContent>You do not have access to edit this property.</CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Edit property #{propertyData.id}</h1>
        <p className="text-sm text-muted-foreground">
          Update the listing details, pricing, and image presentation.
        </p>
      </div>
      <PropertyForm
        mode="edit"
        viewerRole={viewer.role}
        initialProperty={propertyData}
        isSubmitting={uploadImages.isPending || updateProperty.isPending}
        onSubmit={async (values) => {
          try {
            const files = values.images.flatMap((image) =>
              image.file ? [image.file] : [],
            );
            let uploadedPaths: string[] = [];

            if (files.length > 0) {
              const upload = await uploadImages.mutateAsync(files);
              if (
                !isSuccessfulStatus(upload.status) ||
                !upload.data ||
                upload.data.length !== files.length
              ) {
                toast.error("New images could not be uploaded. Try again.");
                return null;
              }
              uploadedPaths = upload.data.map((image) => image.path);
            }

            const images = mergeUploadedPropertyImages(
              values.images,
              uploadedPaths,
            );
            const payload = buildPropertyPayload(values, {
              mode: "edit",
              viewerRole: viewer.role,
              initialProperty: propertyData,
              images,
            }) as UpdatePropertyPayload;
            const response = await updateProperty.mutateAsync({
              id: propertyData.id,
              payload,
            });
            if (!isSuccessfulStatus(response.status) || !response.data) {
              toast.error(response.message || "Property could not be updated.");
              return null;
            }

            await queryClient.invalidateQueries({
              queryKey: propertyKeys.all,
            });
            toast.success("Property updated successfully");
            return response.data;
          } catch (error) {
            console.error(error);
            toast.error(
              "Property could not be updated. Check the form and try again.",
            );
            return null;
          }
        }}
      />
    </div>
  );
}
