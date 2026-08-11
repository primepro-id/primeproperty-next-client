import { env } from "@/lib/env";
import { Article } from "@/lib/types";

export const generateBlogRelatedSchema = async (
  slug: string,
  allArticles: Pick<
    Article,
    "slug" | "title" | "thumbnail" | "_publishedAt" | "_updatedAt"
  >[],
) => {
  const url = `${env.NEXT_PUBLIC_HOST_URL}/blog/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": url + "breadcrumb",
    itemListElement: allArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      item: `${env.NEXT_PUBLIC_HOST_URL}/blog/${article.slug}`,
    })),
  };
};
