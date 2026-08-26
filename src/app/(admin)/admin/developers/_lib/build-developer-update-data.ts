import type { updateDeveloper } from "@/lib/api";

export type DeveloperFormValues = {
  logo_path?: FileList;
  name: string;
};

type DeveloperUpdateData = Parameters<typeof updateDeveloper>[1];

export function buildDeveloperUpdateData(
  { name }: DeveloperFormValues,
  existingLogoPath: string,
  uploadedLogoPath?: string,
): DeveloperUpdateData {
  return {
    name,
    logo_path: uploadedLogoPath ?? existingLogoPath,
  };
}
