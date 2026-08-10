import {  mutationOptions, UseMutationOptions } from "@tanstack/react-query";
import { uploadS3Images } from "../api"; // adjust path as needed
import { JsonResponse, S3 } from "../types";

export const imagesKeys = {
  all: ["s3-images"] as const,
};

// ==========================================
// 2. Standalone Mutation Options (Upload Images)
// ==========================================

/**
 * Mutation options factory for uploading S3 images.
 * Accepts additional parameters to configure onSuccess, onError, retry, etc.
 */
export function getUploadS3ImagesMutationOptions<
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<JsonResponse<S3.Image[]>, Error, File[], TContext>,
    "mutationFn"
  >
) {
  return mutationOptions({
    mutationFn: (files: File[]) => uploadS3Images(files),
    ...options,
  });
}
