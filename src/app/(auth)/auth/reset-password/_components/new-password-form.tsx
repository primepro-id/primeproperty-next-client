"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetAgentPassword } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import { z } from "zod";

type NewPasswordFormProps = {
  token: string;
};

const formSchema = z.object({
  password: z.string().min(8, "Minimum password length is 8 characters"),
  repassword: z.string().min(8, "Minimum confirm password length is 8 characters"),
});

export const NewPasswordForm = ({ token }: NewPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      repassword: ""
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.password !== data.repassword) {
      toast.warning("Passwords do not match");
      return
    }

    setIsLoading(true)
    try {
      const resetPasswordResult = await resetAgentPassword({ password: data.password, token })
      if (resetPasswordResult.status === 400) {
        toast.error("Password reset link expired, please request a new one");
        setTimeout(() => {
         window.location.href = "/auth/forgot-password"
        }, 1000)
        return;
      }

      if (!resetPasswordResult.data) {
        toast.error("Failed to reset password, contact admin immediately!");
        return;
      }

      toast.success("Password reset successfully, please login to continue");
      setTimeout(() => {
       window.location.href = "/auth"
      }, 1000)
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password, contact admin immediately!");
    } finally {
      setIsLoading(false);
    }
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

        <form className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password (8 chars min)</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="*******"
                  type="password"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="repassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="*******"
                  type="password"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LuLoader className="animate-spin" /> : "Change my Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
