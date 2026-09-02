import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/types";

type BlogRelatedProps = {
  slug: string;
  allArticles: Pick<
    Article,
    "title" | "slug" | "thumbnail" | "_publishedAt" | "_updatedAt"
  >[];
};

export const BlogRelated = ({ allArticles }: BlogRelatedProps) => {
  return (
    <div className="flex flex-col gap-4 rounded sticky px-4">
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
