"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSupertokensPassword } from "@/lib/supertokens/update-supertokens-password";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";

type NewPasswordFormProps = {
  userId: string;
};

export const NewPasswordForm = ({ userId }: NewPasswordFormProps) => {
  const router = useRouter();
  const handleAction = async (formData: FormData) => {
    const password = formData.get("password") as string;
    const repassword = formData.get("repassword") as string;

    if (password !== repassword) {
      toast.warning("Passwords do not match");
    }

    try {
      const isPasswordValid = z
        .string()
        .min(8, { message: "Passwod must be at least 8 characters long" })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .safeParse(password);
      if (!isPasswordValid.success) {
        toast.error(
          "Password must contain at least one number and 8 characters long",
        );
        return;
      }

      const changePassword = await updateSupertokensPassword(userId, password);
      if (changePassword.status === "OK") {
        toast.success(
          "Password updated successfully, please login to continue",
        );
        router.push("/auth");
      } else {
        toast.error("Failed to update password, please try again later");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password, please try again later");
    }

    // TODO: Implement password reset logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter new password.</CardTitle>
        <CardDescription>
          Minimum length: 8 characters with at least one number.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" action={handleAction}>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="********"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repassword">Confirm Password</Label>
            <Input
              id="repassword"
              type="password"
              name="repassword"
              placeholder="********"
              required
            />
          </div>

          <Button type="submit">Reset Password</Button>
        </form>
      </CardContent>
    </Card>
  );
};
