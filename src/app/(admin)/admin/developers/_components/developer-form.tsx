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
import type { DeveloperFormValues } from "../_lib/build-developer-update-data";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const createFormSchema = (isLogoRequired: boolean) =>
  z.object({
    logo_path: z
      .any()
      .optional()
      .superRefine((files, context) => {
        const hasLogo = files instanceof FileList && files.length > 0;

        if (isLogoRequired && !hasLogo) {
          context.addIssue({
            code: "custom",
            message: "A logo is required.",
          });
          return;
        }

        if (!hasLogo) return;

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
    name: z.string().min(1, "Name is required"),
  });

type DeveloperFormMode = "create" | "edit";

type DeveloperFormProps = {
  mode?: DeveloperFormMode;
  initialValues?: Omit<DeveloperFormValues, "logo_path">;
  existingLogoUrl?: string;
  isLoading: boolean;
  onSubmit: (data: DeveloperFormValues) => Promise<boolean>;
};

export const DeveloperForm = ({
  mode = "create",
  initialValues,
  existingLogoUrl,
  isLoading,
  onSubmit,
}: DeveloperFormProps) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const formSchema = useMemo(() => createFormSchema(mode === "create"), [mode]);
  const form = useForm<DeveloperFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo_path: undefined,
      name: initialValues?.name ?? "",
    },
  });
  const logoFiles = useWatch({
    control: form.control,
    name: "logo_path",
  });
  const logoFile = logoFiles?.[0];
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>();

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        const submitted = await onSubmit(data);
        if (submitted && mode === "create") {
          form.reset();
          if (logoInputRef.current) logoInputRef.current.value = "";
        }
      })}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <Controller
          name="logo_path"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Logo</FieldLabel>
              <Button
                className="relative size-40 overflow-hidden"
                variant="outline"
                type="button"
                aria-label="Choose developer logo"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoPreviewUrl || existingLogoUrl ? (
                  <Image
                    fill
                    src={logoPreviewUrl ?? existingLogoUrl ?? ""}
                    alt="Developer logo preview"
                    className="object-contain"
                  />
                ) : (
                  <LuUpload />
                )}
              </Button>
              <Input
                id={field.name}
                name={field.name}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                aria-invalid={fieldState.invalid}
                ref={logoInputRef}
                className="hidden"
                multiple={false}
                onChange={(event) => field.onChange(event.target.files)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="Prime Developer"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex items-center justify-between">
        <Link
          href="/admin/developers"
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
