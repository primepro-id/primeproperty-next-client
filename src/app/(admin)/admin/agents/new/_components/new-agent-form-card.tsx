"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentForm } from "../../_components/agent-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { createAgent, uploadS3Images } from "@/lib/api";

export const NewAgentFormCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>New Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <AgentForm
          isLoading={isLoading}
          onSubmit={async (data) => {
            setIsLoading(true);
            try {
              const profilePicture = data.profile_picture_url?.[0];
              if (!profilePicture) {
                toast.error("A profile picture is required");
                return false;
              }

              const s3 = await uploadS3Images([profilePicture]);
              if (!s3.data?.[0].path) {
                toast.error("Fail to upload images, please try again");
                return false;
              }
              const agentCreation = await createAgent({
                ...data,
                profile_picture_url: s3.data?.[0].path,
              });
              if (agentCreation.data) {
                toast.success(
                  "Agent created successfully, reset password is sent to their email",
                );
                return true;
              }
              return false;
            } catch (err) {
              console.error(err);
              toast.error("Fail to create agent, contact admin immediately");
              return false;
            } finally {
              setIsLoading(false);
            }
          }}
        />
      </CardContent>
    </Card>
  );
};
