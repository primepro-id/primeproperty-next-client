import { Article } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { createArticleExcerpt } from "../_lib/create-article-excerpt";

type LatestProps = {
  articles: Article[];
};

export const Latest = ({ articles }: LatestProps) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-semibold md:text-3xl">Artikel Terbaru</p>

      <div className="flex flex-col gap-4">
        {articles.map((art) => (
          <div key={art.slug} className="flex gap-4 border-b pb-4">
            <Link href={`/blog/${art.slug}`} title={art.seo.title}>
              <Image
                src={art.thumbnail.url}
                alt={art.seo.title}
                width={100}
                height={100}
                className="size-12 md:size-24 object-cover aspect-square rounded"
              />
            </Link>

            <div className="text-sm md:text-lg flex-1">
              <p className="text-xs text-muted-foreground">
                {new Date(art._updatedAt).toLocaleString("id-ID")}
              </p>
              <Link
                className="line-clamp-2 hover:underline"
                href={`/blog/${art.slug}`}
                title={art.seo.title}
              >
                {art.title}
              </Link>

              <Link href={`/blog/${art.slug}`} title={art.seo.title}>
                <p className="line-clamp-2 text-muted-foreground text-sm hover:underline">
                  {createArticleExcerpt(art.content)}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
