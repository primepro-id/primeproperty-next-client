import Link from "next/link";
import Image from "next/image";
import { generateBlogRelatedSchema } from "../../_lib/generate-blog-related-schema";
import { Article } from "@/lib/types";

type BlogRelatedProps = {
  slug: string;
  allArticles: Pick<
    Article,
    "title" | "slug" | "thumbnail" | "_publishedAt" | "_updatedAt"
  >[];
};

export const BlogRelated = ({ slug, allArticles }: BlogRelatedProps) => {
  const schema = generateBlogRelatedSchema(slug, allArticles);
  return (
    <div className="flex flex-col gap-4 rounded sticky px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <h3 className="font-semibold border-b">Artikel Terkait</h3>
      <div className="flex flex-col gap-4" id="breadcrumb">
        {allArticles.map((article) => (
          <Link
            href={`/blog/${article.slug}`}
            key={article.slug}
            title={article.title}
            className="hover:underline flex gap-4 items-center"
          >
            <Image
              src={article.thumbnail.url}
              alt={article.title}
              width={400}
              height={400}
              className="object-cover size-12 rounded"
              priority
            />
            <div className="flex flex-col gap-1">
              <div className="text-sm line-clamp-2">{article.title}</div>
              <div className="text-muted-foreground text-xs">
                {new Date(article._publishedAt).toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
