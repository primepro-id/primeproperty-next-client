import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { getIndexablePropertyFilterPaths } from "../filter/_lib/property-filter-sitemap-data";
import { parseFilterParams } from "./parse-filter-params";
import { generateDescription, generateTitle } from "./create-properties-metadata";

type FilterSearchParams = Record<string, string | string[] | undefined>;

export async function generatePropertiesFilterMetadata(
  params: Promise<{ params: string[] }>,
  searchParams: Promise<FilterSearchParams>,
): Promise<Metadata> {
  const [pageParams, pageSearchParams, indexablePaths] = await Promise.all([
    params,
    searchParams,
    getIndexablePropertyFilterPaths(),
  ]);
  const filterPath = `/${pageParams.params.join("/")}`;
  const filterQuery = parseFilterParams(pageParams.params);
  const hasQuery = Object.keys(pageSearchParams).length > 0;

  return createMetadata({
    title: generateTitle(filterQuery),
    description: generateDescription(filterQuery),
    path: `/properties/filter${filterPath}`,
    index: !hasQuery && indexablePaths.includes(filterPath),
  });
}
