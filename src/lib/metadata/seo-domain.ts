type PropertyPathInput = {
  id: number;
  title: string;
};

type RobotsPolicyInput = {
  isQueryVariant?: boolean;
  isValid?: boolean;
  isUtility?: boolean;
  isPrivate?: boolean;
};

type SeoMetadataFieldsInput = {
  hostUrl: string;
  title: string;
  description: string;
  path: string;
  image: string;
  index?: boolean;
};

export function createPropertyPath(property: PropertyPathInput) {
  const titleSlug = property.title
    .trim()
    .replaceAll("&", " ")
    .replaceAll("/", " ")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `/properties/${property.id}-${encodeURIComponent(titleSlug)}`;
}

export function normalizeSeoText(text: string, maxLength: number) {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  if (normalizedText.length <= maxLength) {
    return normalizedText;
  }

  const truncatedText = normalizedText.slice(0, Math.max(0, maxLength + 1));
  const lastWordBoundary = truncatedText.lastIndexOf(" ");
  return (
    lastWordBoundary > 0
      ? truncatedText.slice(0, lastWordBoundary)
      : truncatedText.slice(0, maxLength)
  ).trim();
}

export function resolveSeoRobotsPolicy({
  isQueryVariant = false,
  isValid = true,
  isUtility = false,
  isPrivate = false,
}: RobotsPolicyInput) {
  if (isPrivate) {
    return { index: false, follow: false };
  }

  return {
    index: !isQueryVariant && isValid && !isUtility,
    follow: true,
  };
}

export function createSeoMetadataFields({
  hostUrl,
  title,
  description,
  path,
  image,
  index = true,
}: SeoMetadataFieldsInput) {
  const normalizedHost = hostUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${normalizedHost}${normalizedPath === "/" ? "" : normalizedPath}`;
  const robots = { index, follow: true };

  return {
    title,
    description,
    twitter: {
      title,
      description,
      site: "@primeproindonesia",
      creator: "@primeproindonesia",
      card: "summary_large_image" as const,
      images: [image],
    },
    openGraph: {
      type: "website" as const,
      url: canonicalUrl,
      title,
      description,
      siteName: "PrimePro Indonesia",
      locale: "id_ID",
      images: [image],
    },
    appleWebApp: true,
    applicationName: "PrimePro Indonesia",
    alternates: {
      canonical: canonicalUrl,
    },
    robots,
  };
}
