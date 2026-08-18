"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { z } from "zod";
import { LuLoader } from "react-icons/lu";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { createAgentPasswordResetToken } from "@/lib/api";

const formSchema = z.object({
  email: z.email("Invalid email").min(1, "Email can't be empty"),
});

export const SendEmailForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const forgotPasswordResult = await createAgentPasswordResetToken(
        data.email,
      );

      if (forgotPasswordResult.status === 400) {
        toast.error("Email not found");
        return;
      }

      if (!forgotPasswordResult.data) {
        console.error("No data returned from server");
        toast.error("Server error, contact admin immediately");
        return;
      }

      toast.success("Password reset link sent to your email");
      return;
    } catch (err) {
      console.error(err);
      toast.error("Server error, contact admin immediately");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="email@primeproindonesia.com"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <LuLoader className="animate-spin" /> : "Send Reset Link"}
      </Button>
    </form>
  );
};
