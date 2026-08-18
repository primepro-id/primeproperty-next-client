"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendResetPasswordMail } from "@/lib/mail/send-reset-password-mail";
import { createSupertokensResetPasswordToken } from "@/lib/supertokens/create-supertokens-reset-password-token";
import { getSupertokensUserByEmail } from "@/lib/supertokens/get-supertokens-user-by-email";
import { toast } from "react-toastify";
import { z } from "zod";
import { useStore } from "../_stores";
import { LuLoader } from "react-icons/lu";

export const SendEmailForm = () => {
  const { loadingText, setLoadingText } = useStore();
  const handleAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const isEmailValid = z.string().email().safeParse(email);
    if (!isEmailValid.success) {
      toast.error("Invalid email");
      return;
    }
    try {
      setLoadingText("Checking your email...");
      const user = await getSupertokensUserByEmail(email);
      if (!user) {
        toast.error(`User with email ${email} not found`);
        return;
      }
      const resetPasswordToken = await createSupertokensResetPasswordToken(
        user.id,
        email,
      );
      const resetPasswordMail = await sendResetPasswordMail(
        email,
        resetPasswordToken.token,
      );

      setLoadingText("Sending email...");
      if (resetPasswordMail.accepted.length > 0) {
        toast.success("Email sent, please check your inbox or spam folder");
      } else {
        toast.error("Fail to send emai, please try again later");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error, please try again later");
    } finally {
      setLoadingText("");
    }
  };
  return (
    <form className="flex flex-col gap-4" action={handleAction}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="email@example.com"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loadingText !== ""}>
        {loadingText !== "" ? (
          <span className="flex items-center gap-2">
            <LuLoader className="animate-spin" />
            {loadingText}
          </span>
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </form>
  );
};
