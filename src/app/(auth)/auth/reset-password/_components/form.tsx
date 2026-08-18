import { TokenExpiredCard } from "./token-expired-card";
import { NewPasswordForm } from "./new-password-form";

type ResetPasswordFormProps = {
  token?: string;
};

export const ResetPasswordForm = async ({ token }: ResetPasswordFormProps) => {
  if (!token) {
    return <TokenExpiredCard />;
  }
  return <NewPasswordForm token={token} />;
};
