import { findArticleBySlug } from "@/lib/api";
import { env } from "@/lib/env";
import { Metadata } from "next";

export const generateBlogMetadata = async (
  params: Promise<{ slug: string }>,
): Promise<Metadata> => {
  const { slug } = await params;
  const { article } = await findArticleBySlug(slug);
  const url = `${env.NEXT_PUBLIC_HOST_URL}/blog/${slug}`;
  return {
    title: article.seo.title,
    description: article.seo.description,
    twitter: {
      title: article.seo.title,
      site: "@primeproindonesia",
      creator: "@primeproindonesia",
      card: "summary_large_image",
      images: [article.thumbnail.url],
    },
    openGraph: {
      url,
      type: "website",
      title: article.seo.title,
      description: article.seo.description,
      images: [article.thumbnail.url],
      siteName: "Primepro Indonesia",
    },
    appleWebApp: true,
    applicationName: "Primepro Indonesia",
    alternates: {
      canonical: url,
    },
    robots: "index, follow",
  };
};
