"use client";

import { Button } from "@/components/ui/button";
import { findPropertyNavigationQueryOptions } from "@/lib/hooks/properties";
import type { AgentRole, Property } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, LoaderCircleIcon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  createPropertyFormDefaults,
  extractPropertyNavigationOptions,
  propertyFormSchema,
  type PropertyFormValues,
} from "../../_lib/property-form-domain";
import { DetailsSection } from "./sections/details-section";
import { ImagesSection } from "./sections/images-section";
import { PriceSection } from "./sections/price-section";
import { SeoSection } from "./sections/seo-section";
import { StatusSection } from "./sections/status-section";

export type PropertyFormProps = {
  mode: "create" | "edit";
  viewerRole: AgentRole;
  initialProperty?: Property;
  isSubmitting: boolean;
  onSubmit: (values: PropertyFormValues) => Promise<Property | null>;
};

export function PropertyForm({
  mode,
  viewerRole,
  initialProperty,
  isSubmitting,
  onSubmit,
}: PropertyFormProps) {
  const navigation = useQuery(findPropertyNavigationQueryOptions());
  const navigationOptions = useMemo(
    () => extractPropertyNavigationOptions(navigation.data?.data),
    [navigation.data?.data],
  );
  const defaultValues = useMemo(
    () => createPropertyFormDefaults(initialProperty),
    [initialProperty],
  );
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
    mode: "onTouched",
  });
  const pending = isSubmitting || form.formState.isSubmitting;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        const savedProperty = await onSubmit(values);
        if (savedProperty) {
          form.reset(
            createPropertyFormDefaults(
              mode === "edit" ? savedProperty : undefined,
            ),
          );
        }
      })}
      className="mx-auto flex w-full max-w-7xl flex-col gap-6"
    >
      <fieldset disabled={pending} className="contents">
        <div className="grid gap-6 lg:grid-cols-2">
          <SeoSection control={form.control} options={navigationOptions} />
          <PriceSection form={form} viewerRole={viewerRole} />
          <StatusSection control={form.control} />
          <DetailsSection control={form.control} />
          <ImagesSection form={form} disabled={pending} />
        </div>
      </fieldset>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur">
        <Button asChild variant="outline">
          <Link href="/admin/properties">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to properties
          </Link>
        </Button>
        <div className="flex flex-col items-end gap-1">
          {navigation.isError ? (
            <span className="text-xs text-muted-foreground">
              Location suggestions are unavailable; manual values still work.
            </span>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? (
              <LoaderCircleIcon
                data-icon="inline-start"
                className="animate-spin"
              />
            ) : (
              <SaveIcon data-icon="inline-start" />
            )}
            {pending
              ? "Saving property..."
              : mode === "create"
                ? "Create property"
                : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
