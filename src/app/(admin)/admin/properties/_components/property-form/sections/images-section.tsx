"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { env } from "@/lib/env";
import { PROPERTY_IMAGE_TAGS } from "@/lib/types/properties";
import {
  ImageIcon,
  MoreVerticalIcon,
  StarIcon,
  TagIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";
import {
  ensureSinglePropertyImageCover,
  removePropertyFormImage,
  type PropertyFormImage,
  type PropertyFormValues,
} from "../../../_lib/property-form-domain";
import { PropertySectionCard } from "../property-section-card";

const acceptedImageTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

type ImagesSectionProps = {
  form: UseFormReturn<PropertyFormValues>;
  disabled: boolean;
};

function PropertyImagePreview({ image }: { image: PropertyFormImage }) {
  const [objectUrl, setObjectUrl] = useState<string>();

  useEffect(() => {
    if (!image.file) {
      setObjectUrl(undefined);
      return;
    }

    const nextObjectUrl = URL.createObjectURL(image.file);
    setObjectUrl(nextObjectUrl);
    return () => URL.revokeObjectURL(nextObjectUrl);
  }, [image.file]);

  const source =
    objectUrl ??
    (image.path ? `${env.NEXT_PUBLIC_S3_ENDPOINT}${image.path}` : undefined);

  if (!source) {
    return (
      <div className="flex size-full items-center justify-center bg-muted">
        <ImageIcon aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      fill
      unoptimized={source.startsWith("blob:")}
      src={source}
      alt={image.indonesian_label || image.english_label || "Property image"}
      className="object-cover"
    />
  );
}

export function ImagesSection({ form, disabled }: ImagesSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const images = useWatch({ control: form.control, name: "images" });
  const imageError = form.formState.errors.images;

  const updateImages = (nextImages: PropertyFormImage[]) => {
    form.setValue("images", nextImages, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const files = Array.from(fileList);
    const validFiles = files.filter((file) =>
      acceptedImageTypes.has(file.type),
    );
    if (validFiles.length !== files.length) {
      toast.error("Only PNG, JPEG/JPG, and WebP images are supported.");
    }

    const remainingCapacity = Math.max(0, 8 - images.length);
    const acceptedFiles = validFiles.slice(0, remainingCapacity);
    if (validFiles.length > remainingCapacity) {
      toast.info(`Only ${remainingCapacity} more image(s) can be added.`);
    }

    const newImages = acceptedFiles.map((file) => ({
      key: crypto.randomUUID(),
      file,
      is_cover: false,
      english_label: "",
      indonesian_label: "",
    }));
    updateImages(ensureSinglePropertyImageCover([...images, ...newImages]));

    if (inputRef.current) inputRef.current.value = "";
  };

  const setCover = (index: number) => {
    updateImages(ensureSinglePropertyImageCover(images, index));
  };

  const removeImage = (index: number) => {
    updateImages(removePropertyFormImage(images, index));
  };

  const setTag = (
    index: number,
    tag?: (typeof PROPERTY_IMAGE_TAGS)[number],
  ) => {
    updateImages(
      images.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              english_label: tag?.english_label ?? "",
              indonesian_label: tag?.indonesian_label ?? "",
            }
          : image,
      ),
    );
  };

  return (
    <PropertySectionCard
      title="Property images"
      description="Upload 3–8 images. The cover leads the listing everywhere it appears."
      className="lg:col-span-2"
    >
      <Field data-invalid={Boolean(imageError)} data-disabled={disabled}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="property-images">Images</FieldLabel>
            <FieldDescription>
              {images.length}/8 uploaded. Tags are optional.
            </FieldDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={disabled || images.length >= 8}
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon data-icon="inline-start" />
            Add images
          </Button>
          <Input
            ref={inputRef}
            id="property-images"
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            multiple
            disabled={disabled}
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.key}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
              >
                <PropertyImagePreview image={image} />
                {image.is_cover ? (
                  <Badge className="absolute left-2 top-2 gap-1">
                    <StarIcon />
                    Cover
                  </Badge>
                ) : null}
                {image.indonesian_label ? (
                  <Badge
                    variant="secondary"
                    className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] gap-1"
                  >
                    <TagIcon />
                    <span className="truncate">{image.indonesian_label}</span>
                  </Badge>
                ) : null}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      disabled={disabled}
                      aria-label={`Edit image ${index + 1}`}
                      className="absolute right-2 top-2"
                    >
                      <MoreVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onSelect={() => setCover(index)}>
                        <StarIcon />
                        Set as cover
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <TagIcon />
                          Tag
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuGroup>
                              <DropdownMenuItem onSelect={() => setTag(index)}>
                                No tag
                              </DropdownMenuItem>
                              {PROPERTY_IMAGE_TAGS.map((tag) => (
                                <DropdownMenuItem
                                  key={tag.english_label}
                                  onSelect={() => setTag(index, tag)}
                                >
                                  {tag.indonesian_label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuGroup>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem onSelect={() => removeImage(index)}>
                        <Trash2Icon />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            className="flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 text-muted-foreground"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon />
            <span>Choose at least 3 property images</span>
          </button>
        )}

        {imageError ? (
          <FieldError>
            {typeof imageError.message === "string"
              ? imageError.message
              : "Check the property images and cover selection."}
          </FieldError>
        ) : null}
      </Field>
    </PropertySectionCard>
  );
}
