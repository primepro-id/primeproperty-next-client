'use client'
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuLoader, LuUpload } from "react-icons/lu";
import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  profile_picture_url: z
      .any()
      .refine((files) => files instanceof FileList && files.length > 0, "A picture is required.")
      .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, .png, and .webp formats are supported."
      ),
  fullname: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone_number: z
    .string()
    .min(1, "Phone is required")
    .transform((val) => val.replace(/^0+/, "")),
  instagram: z.string().optional(),
});

type AgentFormProps = {
  isLoading: boolean;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<boolean>;
};

export const AgentForm = ({ onSubmit, isLoading}: AgentFormProps) => {
  const pictureInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile_picture_url: undefined,
      fullname: "",
      email: "",
      phone_number: "",
      instagram: "",
    },
  });


  return (
    <form onSubmit={form.handleSubmit(async (data) => { const submit = await onSubmit(data); if (submit) form.reset()})} className="flex flex-col gap-4">
      <Controller
        name="profile_picture_url"
        control={form.control}
        render={({ field, fieldState }) => {
          const file = field.value?.[0];
          const objectUrl = file ? URL.createObjectURL(file) : null;
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Profile Picture </FieldLabel>
              <Button
                className="size-40 overflow-hidden relative"
                variant="outline"
                type="button"
                onClick={() => pictureInputRef.current?.click()}
              >
                {objectUrl ? (
                  <Image
                    fill
                    src={objectUrl}
                    alt="Profile preview"
                    className="object-cover"
                  />
                ) : (
                  <LuUpload className="size-8" />
                )}
              </Button>
              <Input
                id={field.name}
                name={field.name}
                type="file"
                accept="image/*"
                aria-invalid={fieldState.invalid}
                ref={pictureInputRef}
                className="hidden"
                multiple={false}
                onChange={(e) => field.onChange(e.target.files)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
      <Controller
        name="fullname"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Fullname</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="text"
              aria-invalid={fieldState.invalid}
              placeholder="Agen Primepro Indonesia"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              aria-invalid={fieldState.invalid}
              placeholder="agent@primeproindonesia.com"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="phone_number"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="tel"
              aria-invalid={fieldState.invalid}
              placeholder="08..."
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="instagram"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Instagram (optional)</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="tel"
              aria-invalid={fieldState.invalid}
              placeholder="@primeproindonesia"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex items-center justify-between">
        <Link href="/admin/agents" className={cn(buttonVariants({variant: "outline"}))}>
          Back
        </Link>

        <Button type="submit" disabled={isLoading}>
          {isLoading
?
            <LuLoader className="animate-spin" /> : "Save"
          }
        </Button>
      </div>
    </form>
  );
};
