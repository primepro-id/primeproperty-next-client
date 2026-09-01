function normalizeWhitespace(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function toTitleCase(value) {
  return normalizeWhitespace(value).replace(/(^|[-\s])\S/g, (letter) =>
    letter.toUpperCase(),
  );
}

function createPropertyPath(property) {
  const titleSlug = normalizeWhitespace(property.title)
    .replaceAll("&", " ")
    .replaceAll("/", " ")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `/properties/${property.id}-${encodeURIComponent(titleSlug)}`;
}

function formatStatus(status) {
  if (status === "ForRent") return "For rent";
  if (status === "ForSaleOrRent") return "For sale or rent";
  return "For sale";
}

function formatCurrency(currency) {
  return currency === "Usd" ? "USD" : "IDR";
}

function formatLocation(property) {
  return [property.street, property.regency, property.province]
    .filter(Boolean)
    .map((segment) => toTitleCase(String(segment).replaceAll("-", " ")))
    .join(", ");
}

export function normalizeCatalogProperties(properties) {
  const unique = new Map();

  for (const propertyWithAgent of properties) {
    const property = propertyWithAgent?.[0];
    if (Number.isInteger(property?.id)) {
      unique.set(property.id, propertyWithAgent);
    }
  }

  return Array.from(unique.values()).sort(
    ([left], [right]) => left.id - right.id,
  );
}

export function renderPropertyCatalog(
  properties,
  { hostUrl, generatedAt = new Date() },
) {
  const normalizedHost = String(hostUrl).replace(/\/+$/, "");
  const timestamp = new Date(generatedAt).toISOString();
  const entries = normalizeCatalogProperties(properties).map(
    ([property, agent]) => {
      const description = normalizeWhitespace(property.description).slice(
        0,
        240,
      );
      const measurements = property.measurements ?? {};
      const specifications = property.specifications ?? {};
      const canonicalUrl = `${normalizedHost}${createPropertyPath(property)}`;

      return [
        `## Property ${property.id}: ${normalizeWhitespace(property.title)}`,
        "",
        `- Canonical URL: ${canonicalUrl}`,
        `- Status: ${formatStatus(property.purchase_status)}`,
        `- Availability: ${property.sold_status === "Sold" ? "Sold" : "Available; verify with the listing agent"}`,
        `- Type: ${normalizeWhitespace(property.building_type)}`,
        `- Location: ${formatLocation(property)}`,
        `- Price: ${formatCurrency(property.currency)} ${new Intl.NumberFormat("en-US").format(property.price)}`,
        `- Land area: ${measurements.land_area ?? "Not provided"} m²`,
        `- Building area: ${measurements.building_area ?? "Not provided"} m²`,
        `- Bedrooms: ${specifications.bedrooms ?? "Not provided"}`,
        `- Bathrooms: ${specifications.bathrooms ?? "Not provided"}`,
        `- Parking: ${(specifications.carport ?? 0) + (specifications.garage ?? 0)}`,
        `- Updated: ${property.updated_at}`,
        `- Agent: ${normalizeWhitespace(agent?.fullname) || "Contact PrimePro Indonesia"}`,
        `- Description: ${description}`,
      ].join("\n");
    },
  );

  return [
    "# PrimePro Indonesia Property Catalog",
    "",
    `Generated at: ${timestamp}`,
    "",
    "Prices and availability are time-sensitive. Verify the latest details on the canonical property page or with its listing agent.",
    "",
    `Live inventory: ${normalizedHost}/properties`,
    "",
    ...entries.flatMap((entry) => [entry, ""]),
  ].join("\n");
}
