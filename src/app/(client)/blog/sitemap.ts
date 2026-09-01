import { findArticles } from "@/lib/api";
import { env } from "@/lib/env";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { allArticles } = await findArticles();
  const articlesSitemap = allArticles.map((article) => {
    return {
      url: env.NEXT_PUBLIC_HOST_URL + "/blog/" + article.slug,
      lastModified: new Date(article._updatedAt || article._publishedAt),
    };
  });

  return [
    {
      url: env.NEXT_PUBLIC_HOST_URL + "/blog",
      changeFrequency: "monthly",
    },
    ...articlesSitemap,
  ];
}
