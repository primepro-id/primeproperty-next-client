"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { LuLoader } from "react-icons/lu";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { setAccessToken, setRefreshToken, signinAgent } from "@/lib/api";
import { useState } from "react";

const formSchema = z.object({
  email: z.email("Invalid email").min(1, "Email can't be empty"),
  password: z.string().min(1, "Password can't be empty"),
});

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const signinResult = await signinAgent(data);
      if (signinResult.status === 400) {
        toast.error("Invalid credentials");
        return;
      }

      if (!signinResult.data) {
        console.error("No data returned from server");
        toast.error("Server error, contact admin immediately");
        return;
      }

      setAccessToken(String(signinResult.data.accessToken?.token));
      setRefreshToken(String(signinResult.data.accessToken?.token));
      toast.success("Sign in successful, redirecting...");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Server error, contact admin immediately");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-md p-4 mx:px-0"
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

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="********"
              type="password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <LuLoader className="animate-spin" /> : "Let's Go"}
      </Button>
    </form>
  );
};
