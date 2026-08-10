"use client";
import { env } from "../env";
import { JsonResponse, S3 } from "../types";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = [".png", ".jpeg", ".jpg", ".webp"];

/**
 * Validates files against backend MIME and extension rules.
 */
function validateFiles(files: File[]): string | null {
  for (const file of files) {
    const fileName = file.name.toLowerCase();
    const isValidMime = ALLOWED_MIME_TYPES.has(file.type);
    const isValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!isValidMime && !isValidExt) {
      return `Invalid file format: "${file.name}". Only PNG, JPEG, JPG, and WEBP are allowed.`;
    }
  }
  return null;
}

/**
 * Uploads images to the POST /images endpoint via multipart/form-data.
 *
 * @param files Array of File objects to upload
 * @param baseUrl Base URL for your API (defaults to relative endpoint)
 */
export async function uploadS3Images(
  files: File[],
): Promise<JsonResponse<S3.Image[]>> {
  if (!files || files.length === 0) {
    throw new Error("No files provided for upload.");
  }

  // Optional: Perform client-side validation first to save bandwidth
  const validationError = validateFiles(files);
  if (validationError) {
    throw new Error(validationError);
  }

  const formData = new FormData();
  files.forEach((file) => {
    // Append each file; 'images' or 'file' field name is repeated
    formData.append("images", file);
  });

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/s3/images`, {
    method: "POST",
    // DO NOT set 'Content-Type' manually!
    // Fetch automatically sets 'multipart/form-data; boundary=...'
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || `Upload failed with status ${response.status}`,
    );
  }

  return result.data ?? [];
}
