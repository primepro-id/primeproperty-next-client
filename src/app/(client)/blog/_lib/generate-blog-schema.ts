import { env } from "@/lib/env";
import type { Article } from "@/lib/types";

export function generateBlogSchema(article: Article) {
  const articleUrl = `${env.NEXT_PUBLIC_HOST_URL}/blog/${article.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        url: articleUrl,
        headline: article.title,
        datePublished: new Date(article._publishedAt).toISOString(),
        dateModified: new Date(article._updatedAt).toISOString(),
        thumbnailUrl: article.thumbnail.url,
        articleSection: article.seo.title,
        description: article.seo.description,
        author: {
          "@type": "Organization",
          "@id": `${env.NEXT_PUBLIC_HOST_URL}/#organization`,
          name: "PrimePro Indonesia",
          url: env.NEXT_PUBLIC_HOST_URL,
        },
        image: {
          "@type": "ImageObject",
          url: article.thumbnail.url,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${env.NEXT_PUBLIC_HOST_URL}/#organization`,
          name: "PrimePro Indonesia",
          logo: {
            "@type": "ImageObject",
            url: `${env.NEXT_PUBLIC_HOST_URL}/images/primepro-with-full-text.png`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: env.NEXT_PUBLIC_HOST_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${env.NEXT_PUBLIC_HOST_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
      },
    ],
  };
}
