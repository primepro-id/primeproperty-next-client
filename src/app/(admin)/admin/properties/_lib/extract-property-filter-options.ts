export type PropertyFilterOptions = {
  buildingTypes: string[];
  provinces: string[];
  regencies: string[];
  streets: string[];
};

function decodePathSegment(segment?: string) {
  if (!segment) {
    return undefined;
  }

  try {
    return decodeURIComponent(segment).replaceAll("-", " ").trim();
  } catch {
    return segment.replaceAll("-", " ").trim();
  }
}

function uniqueSorted(values: Array<string | undefined>) {
  const uniqueValues = new Map<string, string>();

  for (const value of values) {
    if (value) {
      uniqueValues.set(value.toLocaleLowerCase("id-ID"), value);
    }
  }

  return Array.from(uniqueValues.values()).sort(
    new Intl.Collator("id-ID").compare,
  );
}

export function extractPropertyFilterOptions(
  paths?: string[] | null,
): PropertyFilterOptions {
  const pathSegments = (paths ?? []).map((path) =>
    path.split("/").filter(Boolean).map(decodePathSegment),
  );

  return {
    buildingTypes: uniqueSorted(pathSegments.map((segments) => segments[1])),
    provinces: uniqueSorted(pathSegments.map((segments) => segments[2])),
    regencies: uniqueSorted(pathSegments.map((segments) => segments[3])),
    streets: uniqueSorted(pathSegments.map((segments) => segments[4])),
  };
}
