"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { LuLoader, LuUpload } from "react-icons/lu";
import * as z from "zod";
import type { AgentFormValues } from "../_lib/build-agent-update-data";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const createFormSchema = (isProfilePictureRequired: boolean) =>
  z.object({
    profile_picture_url: z
      .any()
      .optional()
      .superRefine((files, context) => {
        const hasPicture = files instanceof FileList && files.length > 0;

        if (isProfilePictureRequired && !hasPicture) {
          context.addIssue({
            code: "custom",
            message: "A picture is required.",
          });
          return;
        }

        if (!hasPicture) return;

        if (files[0].size > MAX_FILE_SIZE) {
          context.addIssue({
            code: "custom",
            message: "Max file size is 5MB.",
          });
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(files[0].type)) {
          context.addIssue({
            code: "custom",
            message: "Only .jpg, .jpeg, .png, and .webp formats are supported.",
          });
        }
      }),
    fullname: z.string().min(1, "Fullname is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    phone_number: z
      .string()
      .min(1, "Phone is required")
      .transform((val) => val.replace(/^0+/, "")),
    instagram: z.string().optional(),
  });

type AgentFormMode = "create" | "edit";

type AgentFormProps = {
  mode?: AgentFormMode;
  initialValues?: Omit<AgentFormValues, "profile_picture_url">;
  existingProfilePictureUrl?: string;
  isLoading: boolean;
  onSubmit: (data: AgentFormValues) => Promise<boolean>;
};

export const AgentForm = ({
  mode = "create",
  initialValues,
  existingProfilePictureUrl,
  onSubmit,
  isLoading,
}: AgentFormProps) => {
  const pictureInputRef = useRef<HTMLInputElement>(null);
  const formSchema = useMemo(() => createFormSchema(mode === "create"), [mode]);

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile_picture_url: undefined,
      fullname: initialValues?.fullname ?? "",
      email: initialValues?.email ?? "",
      phone_number: initialValues?.phone_number ?? "",
      instagram: initialValues?.instagram ?? "",
    },
  });
  const pictureFiles = useWatch({
    control: form.control,
    name: "profile_picture_url",
  });
  const pictureFile = pictureFiles?.[0];
  const [picturePreviewUrl, setPicturePreviewUrl] = useState<string>();

  useEffect(() => {
    if (!pictureFile) {
      setPicturePreviewUrl(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(pictureFile);
    setPicturePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [pictureFile]);

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        const submit = await onSubmit(data);
        if (submit && mode === "create") form.reset();
      })}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <Controller
          name="profile_picture_url"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Profile Picture</FieldLabel>
              <Button
                className="relative size-40 overflow-hidden"
                variant="outline"
                type="button"
                aria-label="Choose profile picture"
                onClick={() => pictureInputRef.current?.click()}
              >
                {picturePreviewUrl || existingProfilePictureUrl ? (
                  <Image
                    fill
                    src={picturePreviewUrl ?? existingProfilePictureUrl ?? ""}
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
          )}
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
                readOnly={mode === "edit"}
                aria-readonly={mode === "edit"}
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
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="@primeproindonesia"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/agents"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back
        </Link>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <LuLoader data-icon="inline-start" className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
};
