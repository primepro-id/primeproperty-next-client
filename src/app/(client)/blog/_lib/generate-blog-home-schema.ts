import { env } from "@/lib/env";
import { Article } from "@/lib/types";

export const generateBlogHomeSchema = (articles: Article[]) => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${env.NEXT_PUBLIC_HOST_URL}/blog`,
    name: "Tips dan Trik Pemilihan Properti | PrimePro Indonesia",
    description:
      "Artikel Primepro Indonesia menyuguhkan tips dan trik terkini seputar properti dan ulasan mengenai rumah hingga gaya hidup",
    thumbnailUrl: `${env.NEXT_PUBLIC_HOST_URL}/image/primepro-with-full-text.png`,
    isPartOf: {
      "@type": "WebSite",
      url: env.NEXT_PUBLIC_HOST_URL,
      name: "Primepro Indonesia Blog",
    },
    author: {
      "@type": "Organization",
      name: "PrimePro Indonesia",
      url: env.NEXT_PUBLIC_HOST_URL,
    },
    image: {
      "@type": "ImageObject",
      url: `${env.NEXT_PUBLIC_HOST_URL}/image/primepro-with-full-text.png`,
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      item: `${env.NEXT_PUBLIC_HOST_URL}/blog/${article.slug}`,
    })),
  };
  return { homeSchema, breadcrumbSchema };
};
