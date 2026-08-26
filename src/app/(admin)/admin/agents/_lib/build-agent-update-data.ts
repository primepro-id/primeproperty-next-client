import type { updateAgent } from "@/lib/api";

export type AgentFormValues = {
  profile_picture_url?: FileList;
  fullname: string;
  email: string;
  phone_number: string;
  instagram?: string;
};

type AgentUpdateData = Parameters<typeof updateAgent>[1];

export function buildAgentUpdateData(
  { fullname, phone_number, instagram }: AgentFormValues,
  profilePictureUrl?: string,
): AgentUpdateData {
  return {
    fullname,
    phone_number,
    instagram: instagram ?? "",
    ...(profilePictureUrl
      ? { profile_picture_url: profilePictureUrl }
      : undefined),
  };
}
