import { findPropertySitePaths } from "@/lib/api";
import { env } from "@/lib/env";
import { MetadataRoute } from "next";
import { parseFilterParams } from "../_lib/parse-filter-params";
import qs from "qs";

const generatePropertySitePathSitemaps = async () => {
  const properties = await findPropertySitePaths();
  const sitemaps = [];
  const baseUrl = env.NEXT_PUBLIC_HOST_URL + `/properties`;
  if (Array.isArray(properties?.data)) {
    for (const path of properties?.data) {
      sitemaps.push({
        url: baseUrl + `/filter${path}`,
        lastModified: new Date(),
      });

      const pathArray = path.split("/");
      pathArray.shift();
      const filterParams = parseFilterParams(pathArray);
      for (let i = 1; i <= 10; i++) {
        const urlParam = qs.stringify({ ...filterParams, page: i });
        sitemaps.push({
          url: baseUrl + "?" + urlParam.replaceAll("&", "&amp;"),
          lastModified: new Date(),
        });
      }
    }
    return sitemaps;
  }

  return [];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const sitePathsSitemaps = await generatePropertySitePathSitemaps();

  return sitePathsSitemaps;
}
