import type {
  AgentRole,
  Property,
  PropertyFacilities,
  PropertyImage,
  PropertyNavigation,
} from "@/lib/types";
import * as z from "zod";

const optionalNonNegativeInteger = z
  .number()
  .int("Use a whole number")
  .min(0, "Value cannot be negative")
  .optional();

const propertyFormImageSchema = z.object({
  key: z.string(),
  file: z.custom<File>().optional(),
  path: z.string().optional(),
  is_cover: z.boolean(),
  english_label: z.string(),
  indonesian_label: z.string(),
});

export const propertyFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    province: z.string().trim().min(1, "Province is required"),
    regency: z.string().trim().min(1, "Regency is required"),
    street: z.string().trim().min(1, "Street is required"),
    gmap_iframe: z.string(),
    purchase_status: z.enum(["ForSale", "ForRent"]),
    rent_time: z.enum(["Monthly", "Yearly"]).nullable(),
    price: z
      .number()
      .int("Use a whole number")
      .positive("Price must be greater than zero"),
    price_down_payment: z
      .number({ error: "Down payment is required" })
      .int("Use a whole number")
      .min(0, "Down payment cannot be negative"),
    currency: z.enum(["Idr", "Usd"]),
    sold_channel: z
      .enum(["Web", "R123", "Socmed", "Banner", "Others"])
      .nullable(),
    is_njop_price: z.boolean(),
    is_popular: z.boolean(),
    building_type: z.string().trim().min(1, "Building type is required"),
    building_condition: z.enum([
      "New",
      "Good",
      "Renovated",
      "RenovationRequired",
      "Old",
    ]),
    building_certificate: z
      .string()
      .trim()
      .min(1, "Building certificate is required"),
    building_furniture_capacity: z
      .enum(["Furnished", "SemiFurnished", "Unfurnished"])
      .nullable(),
    measurements: z.object({
      building_area: optionalNonNegativeInteger,
      building_level: optionalNonNegativeInteger,
      land_area: optionalNonNegativeInteger,
    }),
    specifications: z.object({
      bathrooms: optionalNonNegativeInteger,
      bedrooms: optionalNonNegativeInteger,
      carport: optionalNonNegativeInteger,
      electrical_power: optionalNonNegativeInteger,
      garage: optionalNonNegativeInteger,
    }),
    facilities: z.array(
      z.object({
        value: z.string(),
        indonesian_label: z.string(),
      }),
    ),
    images: z
      .array(propertyFormImageSchema)
      .min(3, "Upload at least 3 images")
      .max(8, "Upload no more than 8 images"),
  })
  .superRefine((values, context) => {
    if (values.purchase_status !== "ForRent" && values.rent_time !== null) {
      context.addIssue({
        code: "custom",
        path: ["rent_time"],
        message: "Rent time is available only for rental properties",
      });
    }

    if (values.images.filter((image) => image.is_cover).length !== 1) {
      context.addIssue({
        code: "custom",
        path: ["images"],
        message: "Choose exactly one cover image",
      });
    }

    if (values.gmap_iframe.trim()) {
      try {
        normalizeGoogleMapsIframe(values.gmap_iframe);
      } catch {
        context.addIssue({
          code: "custom",
          path: ["gmap_iframe"],
          message: "Paste a valid Google Maps embed iframe",
        });
      }
    }
  });

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
export type PropertyFormImage = PropertyFormValues["images"][number];

export type PropertyNavigationOptions = {
  provinces: string[];
  regencies: string[];
  streets: string[];
};

function uniqueSorted(values: string[]) {
  const unique = new Map<string, string>();

  for (const rawValue of values) {
    const value = rawValue.trim();
    const key = value.toLocaleLowerCase("id-ID");
    if (value && !unique.has(key)) unique.set(key, value);
  }

  return Array.from(unique.values()).sort(new Intl.Collator("id-ID").compare);
}

export function extractPropertyNavigationOptions(
  navigation?: Array<
    Pick<PropertyNavigation, "province" | "regency" | "street">
  > | null,
): PropertyNavigationOptions {
  const values = navigation ?? [];

  return {
    provinces: uniqueSorted(values.map((item) => item.province)),
    regencies: uniqueSorted(values.map((item) => item.regency)),
    streets: uniqueSorted(values.map((item) => item.street)),
  };
}

export function formatCompactPropertyPrice(value: number, currency: string) {
  const prefix = currency === "Usd" ? "$" : "Rp ";
  const units = [
    { minimum: 1_000_000_000, divisor: 1_000_000_000, suffix: "B" },
    { minimum: 1_000_000, divisor: 1_000_000, suffix: "M" },
    { minimum: 1_000, divisor: 1_000, suffix: "K" },
  ];
  const unit = units.find((item) => value >= item.minimum);

  if (!unit) return `${prefix}${new Intl.NumberFormat("id-ID").format(value)}`;

  const compactValue = Number((value / unit.divisor).toFixed(1));
  return `${prefix}${compactValue}${unit.suffix}`;
}

export type NormalizedGoogleMapsIframe = {
  src: string;
  html: string;
};

export function normalizeGoogleMapsIframe(
  iframe: string,
): NormalizedGoogleMapsIframe | null {
  const value = iframe.trim();
  if (!value) return null;

  const match = value.match(
    /^<iframe\b[^>]*\bsrc\s*=\s*(["'])(https:[^"']+)\1[^>]*>\s*<\/iframe>$/i,
  );
  if (!match) throw new Error("Invalid iframe markup");

  const url = new URL(match[2]);
  const isGoogleHost =
    url.hostname === "google.com" || url.hostname.endsWith(".google.com");
  const isEmbedPath =
    url.pathname.includes("/maps/embed") ||
    url.searchParams.get("output") === "embed";

  if (url.protocol !== "https:" || !isGoogleHost || !isEmbedPath) {
    throw new Error("Invalid Google Maps embed URL");
  }

  const src = url.toString();
  const escapedSrc = src.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

  return {
    src,
    html: `<iframe src="${escapedSrc}" width="100%" height="360" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
  };
}

export function ensureSinglePropertyImageCover(
  images: PropertyFormImage[],
  preferredIndex?: number,
) {
  if (images.length === 0) return [];

  const existingCoverIndex = images.findIndex((image) => image.is_cover);
  const coverIndex =
    preferredIndex !== undefined && images[preferredIndex]
      ? preferredIndex
      : existingCoverIndex >= 0
        ? existingCoverIndex
        : 0;

  return images.map((image, index) => ({
    ...image,
    is_cover: index === coverIndex,
  }));
}

export function removePropertyFormImage(
  images: PropertyFormImage[],
  imageIndex: number,
) {
  const nextImages = images.filter((_, index) => index !== imageIndex);
  return ensureSinglePropertyImageCover(nextImages);
}

export function mergeUploadedPropertyImages(
  images: PropertyFormImage[],
  uploadedPaths: string[],
): PropertyImage[] {
  let uploadedIndex = 0;
  const propertyImages = images.map((image) => {
    const path = image.path ?? uploadedPaths[uploadedIndex++];
    if (!path) throw new Error("An uploaded image path is missing");

    return {
      path,
      is_cover: image.is_cover,
      english_label: image.english_label,
      indonesian_label: image.indonesian_label,
    };
  });

  if (uploadedIndex !== uploadedPaths.length) {
    throw new Error("Uploaded image count does not match the selected files");
  }

  return propertyImages;
}

type PropertyPayloadContext = {
  mode: "create" | "edit";
  viewerRole: AgentRole | `${AgentRole}`;
  initialProperty?: Pick<Property, "sold_channel" | "configurations">;
  images: PropertyImage[];
};

const optionalNumberToApi = (value: number | undefined) => value ?? 0;

export function buildPropertyPayload(
  values: PropertyFormValues,
  context: PropertyPayloadContext,
) {
  const normalizedMap = normalizeGoogleMapsIframe(values.gmap_iframe);
  const isAdmin = context.viewerRole === "Admin";
  const soldChannel = isAdmin
    ? values.sold_channel
    : context.mode === "edit"
      ? (context.initialProperty?.sold_channel ?? null)
      : null;
  const isPopular = isAdmin
    ? values.is_popular
    : context.mode === "edit"
      ? (context.initialProperty?.configurations.is_popular ?? false)
      : false;

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    province: values.province.trim(),
    regency: values.regency.trim(),
    street: values.street.trim(),
    gmap_iframe:
      normalizedMap?.html ?? (context.mode === "edit" ? "" : undefined),
    purchase_status: values.purchase_status,
    rent_time: values.purchase_status === "ForRent" ? values.rent_time : null,
    price: values.price,
    price_down_payment: values.price_down_payment,
    currency: values.currency,
    sold_channel: soldChannel,
    configurations: {
      ...(context.initialProperty?.configurations ?? {}),
      is_njop_price: values.is_njop_price,
      is_popular: isPopular,
    },
    building_type: values.building_type,
    building_condition: values.building_condition,
    building_certificate: values.building_certificate,
    building_furniture_capacity: values.building_furniture_capacity,
    measurements: {
      building_area: optionalNumberToApi(values.measurements.building_area),
      building_level: optionalNumberToApi(values.measurements.building_level),
      land_area: optionalNumberToApi(values.measurements.land_area),
    },
    specifications: {
      bathrooms: optionalNumberToApi(values.specifications.bathrooms),
      bedrooms: optionalNumberToApi(values.specifications.bedrooms),
      carport: optionalNumberToApi(values.specifications.carport),
      electrical_power: optionalNumberToApi(
        values.specifications.electrical_power,
      ),
      garage: optionalNumberToApi(values.specifications.garage),
    },
    facilities: values.facilities as PropertyFacilities[],
    images: context.images,
  };
}

export function createPropertyFormDefaults(
  initialProperty?: Property,
): PropertyFormValues {
  return {
    title: initialProperty?.title ?? "",
    description: initialProperty?.description ?? "",
    province: initialProperty?.province ?? "",
    regency: initialProperty?.regency ?? "",
    street: initialProperty?.street ?? "",
    gmap_iframe: initialProperty?.gmap_iframe ?? "",
    purchase_status:
      initialProperty?.purchase_status === "ForRent" ? "ForRent" : "ForSale",
    rent_time: initialProperty?.rent_time ?? null,
    price: initialProperty?.price ?? 0,
    price_down_payment: initialProperty?.price_down_payment ?? 0,
    currency: initialProperty?.currency === "Usd" ? "Usd" : "Idr",
    sold_channel: initialProperty?.sold_channel ?? null,
    is_njop_price: initialProperty?.configurations.is_njop_price ?? false,
    is_popular: initialProperty?.configurations.is_popular ?? false,
    building_type: initialProperty?.building_type ?? "",
    building_condition: initialProperty?.building_condition ?? "Good",
    building_certificate: initialProperty?.building_certificate ?? "",
    building_furniture_capacity:
      initialProperty?.building_furniture_capacity ?? null,
    measurements: {
      building_area: initialProperty?.measurements.building_area || undefined,
      building_level: initialProperty?.measurements.building_level || undefined,
      land_area: initialProperty?.measurements.land_area || undefined,
    },
    specifications: {
      bathrooms: initialProperty?.specifications.bathrooms || undefined,
      bedrooms: initialProperty?.specifications.bedrooms || undefined,
      carport: initialProperty?.specifications.carport || undefined,
      electrical_power:
        initialProperty?.specifications.electrical_power || undefined,
      garage: initialProperty?.specifications.garage || undefined,
    },
    facilities: initialProperty?.facilities ?? [],
    images: ensureSinglePropertyImageCover(
      (initialProperty?.images ?? []).map((image, index) => ({
        key: `${image.path}-${index}`,
        path: image.path,
        is_cover: image.is_cover,
        english_label: image.english_label,
        indonesian_label: image.indonesian_label,
      })),
    ),
  };
}
