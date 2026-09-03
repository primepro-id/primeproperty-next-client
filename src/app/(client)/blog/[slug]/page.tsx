import Image from "next/image";
import { generateBlogMetadata } from "../_lib/generate-blog-metadata";
import { Metadata } from "next";
import { generateBlogSchema } from "../_lib/generate-blog-schema";
import { BlogPost } from "./_components/blog-post";
import { BlogRelated } from "./_components/blog-related";
import { BlogRelatedProperties } from "./_components/blog-related-properties";
import { Faq } from "../../properties/_components/faq";
import { findArticleBySlug } from "@/lib/api/articles";

export const revalidate = 0;

type BlogSlugProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: BlogSlugProps): Promise<Metadata> => generateBlogMetadata(params);

const BlogSlug = async ({ params }: BlogSlugProps) => {
  const { slug } = await params;
  const { article, allArticles } = await findArticleBySlug(slug);
  const schema = generateBlogSchema(article);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="flex flex-col gap-4 font-sans">
        <div className="w-full h-48 md:h-96 relative">
          <Image
            src={article.thumbnail.url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container gap-16 flex flex-col p-4 mx-auto ">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between min-h-screen">
            <BlogPost article={article} />
            <BlogRelated slug={slug} allArticles={allArticles} />
          </div>
          {article.showRelatedProperties && (
            <BlogRelatedProperties
              relatedProperties={article.relatedProperties}
            />
          )}
          <Faq defaultTab="PROPERTY" />
        </div>
      </div>
    </>
  );
};

export default BlogSlug;
