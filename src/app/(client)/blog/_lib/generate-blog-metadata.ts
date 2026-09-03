import { findArticleBySlug } from "@/lib/api/articles";
import { createMetadata } from "@/lib/metadata";
import { normalizeSeoText } from "@/lib/metadata/seo-domain";
import type { Metadata } from "next";

export async function generateBlogMetadata(
  params: Promise<{ slug: string }>,
): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await findArticleBySlug(slug);

  if (!article) {
    return createMetadata({
      title: "Artikel tidak ditemukan | PrimePro Indonesia",
      description: "Artikel yang Anda cari tidak tersedia.",
      path: `/blog/${slug}`,
      index: false,
    });
  }

  return createMetadata({
    title: normalizeSeoText(article.seo.title, 70),
    description: normalizeSeoText(article.seo.description, 160),
    path: `/blog/${slug}`,
    image: article.thumbnail.url,
  });
}
