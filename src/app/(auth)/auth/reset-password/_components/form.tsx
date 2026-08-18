import { consumeSupertokensResetPasswordToken } from "@/lib/supertokens/consume-supertokens-reset-password-token";
import { TokenExpiredCard } from "./token-expired-card";
import { NewPasswordForm } from "./new-password-form";

type ResetPasswordFormProps = {
  token?: string;
};

export const ResetPasswordForm = async ({ token }: ResetPasswordFormProps) => {
  const tokenValidation = await consumeSupertokensResetPasswordToken(
    token ?? "",
  );
  if (tokenValidation.status !== "OK") {
    return <TokenExpiredCard />;
  }
  return <NewPasswordForm userId={tokenValidation.userId} />;
};
