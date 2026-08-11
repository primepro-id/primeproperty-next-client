import { env } from "@/lib/env";
import { Article } from "@/lib/types";

export const generateBlogSchema = async (article: Article) => {
  const url = `${env.NEXT_PUBLIC_HOST_URL}/blog/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url + "#article",
    url: url,
    headline: article.title,
    datePublished: new Date(article._publishedAt).toISOString(),
    dateModified: new Date(article._updatedAt).toISOString(),
    thumbnailUrl: article.thumbnail.url,
    articleSection: article.seo.title,
    description: article.seo.description,
    author: {
      "@type": "Organization",
      name: "PrimePro Indonesia",
      url: env.NEXT_PUBLIC_HOST_URL,
    },
    image: {
      "@type": "ImageObject",
      url: article.thumbnail.url,
    },
    publisher: {
      "@type": "Organization",
      name: "PrimePro Indonesia",
      logo: {
        "@type": "ImageObject",
        url: `${env.NEXT_PUBLIC_HOST_URL}/images/primepro-with-full-text.png`,
      },
    },
  };
};
