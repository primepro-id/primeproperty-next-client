type PropertyPathInput = {
  id: number;
  title: string;
};

type AgentPathInput = {
  fullname: string;
};

type PropertySeoDescriptionInput = {
  title: string;
  description: string | null;
};

type AgentSeoDescriptionInput = {
  fullname: string;
  description: string | null;
};

type PropertyCollectionSeoDescriptionInput = {
  propertyType: string;
  status: string;
  location: string;
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

const SEO_DESCRIPTION_MIN_LENGTH = 150;
const SEO_DESCRIPTION_MAX_LENGTH = 160;
const SEO_DESCRIPTION_COMPLETION =
  " Temukan informasi lengkap dan layanan agen tepercaya dari PrimePro Indonesia.";
const PROPERTY_SEO_DESCRIPTION_FALLBACK =
  "Jelajahi properti pilihan PrimePro Indonesia dengan informasi lengkap, harga terbaru, fasilitas unggulan, dan layanan agen tepercaya untuk kebutuhan Anda.";
const PROPERTY_COLLECTION_SEO_DESCRIPTION_FALLBACK =
  "Temukan properti dijual di Indonesia dengan detail harga, foto, lokasi, fasilitas, dan agen tepercaya dari PrimePro untuk membantu kebutuhan properti Anda.";
const AGENT_SEO_DESCRIPTION_FALLBACK =
  "Temukan agen properti PrimePro Indonesia dengan informasi layanan, konsultasi tepercaya, dan pilihan properti terbaik untuk kebutuhan Anda secara menyeluruh.";

export function createPropertyPath(property: PropertyPathInput) {
  const titleSlug = property.title
    .trim()
    .replaceAll("&", " ")
    .replaceAll("/", " ")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `/properties/${property.id}-${encodeURIComponent(titleSlug)}`;
}

export function createAgentPath(agent: AgentPathInput) {
  const fullnameSlug = agent.fullname.trim().replace(/\s+/g, "-");

  return `/agents/${encodeURIComponent(fullnameSlug)}`;
}

export function decodeAgentRouteName(name: string) {
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
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

function createBoundedSeoDescription(text: string, fallback: string) {
  const description = normalizeSeoText(text, SEO_DESCRIPTION_MAX_LENGTH);
  if (description.length >= SEO_DESCRIPTION_MIN_LENGTH) {
    return description;
  }

  const completedDescription = `${normalizeSeoText(
    text,
    SEO_DESCRIPTION_MAX_LENGTH - SEO_DESCRIPTION_COMPLETION.length,
  )}${SEO_DESCRIPTION_COMPLETION}`;

  return completedDescription.length >= SEO_DESCRIPTION_MIN_LENGTH
    ? completedDescription
    : fallback;
}

export function createPropertySeoDescription({
  title,
  description,
}: PropertySeoDescriptionInput) {
  const normalizedTitle = normalizeSeoText(title, 70);
  const propertyDescription =
    description || "Properti pilihan untuk hunian atau investasi Anda.";

  return createBoundedSeoDescription(
    `Jelajahi ${normalizedTitle}. ${propertyDescription} Temukan informasi lokasi, harga, fasilitas, dan layanan agen tepercaya PrimePro Indonesia untuk pilihan properti yang tepat.`,
    PROPERTY_SEO_DESCRIPTION_FALLBACK,
  );
}

export function createPropertyCollectionSeoDescription({
  propertyType,
  status,
  location,
}: PropertyCollectionSeoDescriptionInput) {
  return createBoundedSeoDescription(
    `Temukan ${propertyType} ${status} di ${location} dengan detail harga, foto, lokasi, fasilitas, dan agen tepercaya dari PrimePro untuk membantu kebutuhan properti Anda.`,
    PROPERTY_COLLECTION_SEO_DESCRIPTION_FALLBACK,
  );
}

export function createAgentSeoDescription({
  fullname,
  description,
}: AgentSeoDescriptionInput) {
  const normalizedFullname = normalizeSeoText(fullname, 70);
  const agentDescription =
    description || "Agen properti profesional dari PrimePro Indonesia.";

  return createBoundedSeoDescription(
    `Kenali ${normalizedFullname}, agen properti PrimePro Indonesia. ${agentDescription} Dapatkan informasi layanan, konsultasi, dan pilihan properti dari agen tepercaya untuk kebutuhan Anda.`,
    AGENT_SEO_DESCRIPTION_FALLBACK,
  );
}

export function createMissingPropertySeoDetails() {
  return {
    title: "Properti tidak ditemukan | PrimePro Indonesia",
    description: createBoundedSeoDescription(
      "Properti yang Anda cari tidak tersedia saat ini. Jelajahi pilihan properti terbaru dengan detail lokasi, harga, fasilitas, dan layanan agen tepercaya PrimePro Indonesia untuk kebutuhan Anda.",
      PROPERTY_SEO_DESCRIPTION_FALLBACK,
    ),
    index: true,
  };
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
