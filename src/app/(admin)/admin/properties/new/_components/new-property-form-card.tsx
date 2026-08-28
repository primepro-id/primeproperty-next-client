"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreatePropertyPayload } from "@/lib/api/properties";
import {
  accessTokenQueryOptions,
  createPropertyMutationOptions,
  propertyKeys,
  uploadS3ImagesMutationOptions,
} from "@/lib/hooks";
import type { Agent } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwt from "jsonwebtoken";
import { toast } from "react-toastify";
import { PropertyForm } from "../../_components/property-form/property-form";
import {
  buildPropertyPayload,
  mergeUploadedPropertyImages,
} from "../../_lib/property-form-domain";

function isSuccessfulStatus(status: number) {
  return status >= 200 && status < 300;
}

export function NewPropertyFormCard() {
  const queryClient = useQueryClient();
  const accessToken = useQuery(accessTokenQueryOptions());
  const uploadImages = useMutation(uploadS3ImagesMutationOptions());
  const createProperty = useMutation(createPropertyMutationOptions());
  const viewer = accessToken.data
    ? (jwt.decode(accessToken.data) as Agent | null)
    : null;

  if (accessToken.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading form...</p>;
  }

  if (accessToken.isError || !viewer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>New property</CardTitle>
        </CardHeader>
        <CardContent>
          Unable to verify your account. Sign in again before creating a
          property.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Create property</h1>
        <p className="text-sm text-muted-foreground">
          Publish a complete listing for the PrimeProperty catalog.
        </p>
      </div>
      <PropertyForm
        mode="create"
        viewerRole={viewer.role}
        isSubmitting={uploadImages.isPending || createProperty.isPending}
        onSubmit={async (values) => {
          try {
            const files = values.images.flatMap((image) =>
              image.file ? [image.file] : [],
            );
            const upload = await uploadImages.mutateAsync(files);
            if (
              !isSuccessfulStatus(upload.status) ||
              !upload.data ||
              upload.data.length !== files.length
            ) {
              toast.error("Images could not be uploaded. Try again.");
              return null;
            }

            const images = mergeUploadedPropertyImages(
              values.images,
              upload.data.map((image) => image.path),
            );
            const payload = buildPropertyPayload(values, {
              mode: "create",
              viewerRole: viewer.role,
              images,
            }) as CreatePropertyPayload;
            const response = await createProperty.mutateAsync(payload);
            if (!isSuccessfulStatus(response.status) || !response.data) {
              toast.error(response.message || "Property could not be created.");
              return null;
            }

            await queryClient.invalidateQueries({
              queryKey: propertyKeys.all,
            });
            toast.success("Property created successfully");
            return response.data;
          } catch (error) {
            console.error(error);
            toast.error(
              "Property could not be created. Check the form and try again.",
            );
            return null;
          }
        }}
      />
    </div>
  );
}
