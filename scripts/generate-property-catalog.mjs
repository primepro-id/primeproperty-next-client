import nextEnv from "@next/env";
import { writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { renderPropertyCatalog } from "./property-catalog-domain.mjs";

const { loadEnvConfig } = nextEnv;

function createPropertiesUrl(apiUrl, page) {
  const endpoint = new URL(
    `${String(apiUrl).replace(/\/+$/, "")}/properties/join-agents`,
  );
  endpoint.searchParams.set("page", String(page));
  endpoint.searchParams.set("limit", "100");
  return endpoint.toString();
}

async function fetchPropertyPage(apiUrl, page, fetchImpl) {
  const response = await fetchImpl(createPropertiesUrl(apiUrl, page));
  if (!response.ok) {
    throw new Error(
      `Property catalog request failed with status ${response.status}.`,
    );
  }

  const payload = await response.json();
  const pageData = payload?.data;
  if (
    !Array.isArray(pageData?.data) ||
    !Number.isInteger(pageData?.pagination?.total_pages) ||
    pageData.pagination.total_pages < 1
  ) {
    throw new Error("Property catalog API response is malformed.");
  }

  return pageData;
}

export async function generatePropertyCatalog({
  apiUrl,
  hostUrl,
  fetchImpl = fetch,
  writeFileImpl = writeFile,
  outputPath,
  generatedAt = new Date(),
}) {
  if (!apiUrl || !hostUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL and NEXT_PUBLIC_HOST_URL are required to generate the property catalog.",
    );
  }

  const firstPage = await fetchPropertyPage(apiUrl, 1, fetchImpl);
  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.pagination.total_pages - 1 }, (_, index) =>
      fetchPropertyPage(apiUrl, index + 2, fetchImpl),
    ),
  );
  const properties = [
    ...firstPage.data,
    ...remainingPages.flatMap((page) => page.data),
  ];
  const markdown = renderPropertyCatalog(properties, {
    hostUrl,
    generatedAt,
  });

  await writeFileImpl(outputPath, `${markdown.trimEnd()}\n`, "utf8");
}

async function main() {
  const projectRoot = process.cwd();
  loadEnvConfig(projectRoot);

  await generatePropertyCatalog({
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    hostUrl: process.env.NEXT_PUBLIC_HOST_URL,
    outputPath: join(projectRoot, "public", "property-catalog.md"),
  });
}

const executedUrl = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : "";

if (import.meta.url === executedUrl) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
