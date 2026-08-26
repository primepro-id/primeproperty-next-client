"use client";

import Loading from "@/app/(client)/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";
import {
  agentKeys,
  getAgentByIdQueryOptions,
  updateAgentMutationOptions,
  uploadS3ImagesMutationOptions,
} from "@/lib/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AgentForm } from "../../_components/agent-form";
import { buildAgentUpdateData } from "../../_lib/build-agent-update-data";

type EditAgentFormCardProps = {
  agentId: string;
};

export const EditAgentFormCard = ({ agentId }: EditAgentFormCardProps) => {
  const queryClient = useQueryClient();
  const agent = useQuery(getAgentByIdQueryOptions(agentId));
  const uploadProfilePicture = useMutation(uploadS3ImagesMutationOptions());
  const updateAgent = useMutation(updateAgentMutationOptions());

  if (agent.isPending) return <Loading />;

  if (agent.isError || !agent.data?.data) {
    return (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Edit Agent</CardTitle>
        </CardHeader>
        <CardContent>
          Unable to load this agent. Please try again later.
        </CardContent>
      </Card>
    );
  }

  const agentData = agent.data.data;
  const existingProfilePictureUrl = agentData.profile_picture_url
    ? env.NEXT_PUBLIC_S3_ENDPOINT + agentData.profile_picture_url
    : undefined;
  const isLoading = uploadProfilePicture.isPending || updateAgent.isPending;

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Edit Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <AgentForm
          mode="edit"
          isLoading={isLoading}
          existingProfilePictureUrl={existingProfilePictureUrl}
          initialValues={{
            fullname: agentData.fullname,
            email: agentData.email,
            phone_number: agentData.phone_number,
            instagram: agentData.instagram ?? "",
          }}
          onSubmit={async (data) => {
            try {
              const profilePicture = data.profile_picture_url?.[0];
              let profilePictureUrl: string | undefined;

              if (profilePicture) {
                const upload = await uploadProfilePicture.mutateAsync([
                  profilePicture,
                ]);
                profilePictureUrl = upload.data?.[0]?.path;

                if (!profilePictureUrl) {
                  toast.error("Fail to upload image, please try again");
                  return false;
                }
              }

              const updatedAgent = await updateAgent.mutateAsync({
                id: agentId,
                updateData: buildAgentUpdateData(data, profilePictureUrl),
              });

              if (!updatedAgent.data) {
                toast.error("Fail to update agent, please try again");
                return false;
              }

              await queryClient.invalidateQueries({
                queryKey: agentKeys.all,
              });
              toast.success("Agent updated successfully");
              return true;
            } catch (error) {
              console.error(error);
              toast.error("Fail to update agent, contact admin immediately");
              return false;
            }
          }}
        />
      </CardContent>
    </Card>
  );
};
