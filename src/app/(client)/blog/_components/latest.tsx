"use client";
import { Article } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LatestProps = {
  articles: Article[];
};

export const Latest = ({ articles }: LatestProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-semibold md:text-3xl">Artikel Terbaru</p>

      <div className="flex flex-col gap-4">
        {articles.map((art) => (
          <div key={art.slug} className="flex gap-4 border-b pb-4">
            <Image
              src={art.thumbnail.url}
              alt={art.seo.title}
              title={art.seo.title}
              width={100}
              height={100}
              className="size-12 md:size-24 object-cover aspect-square rounded cursor-pointer"
              onClick={() => router.push(`/blog/${art.slug}`)}
            />

            <div className="text-sm md:text-lg">
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

              <div
                className="line-clamp-2 text-muted-foreground text-sm cursor-pointer hover:underline"
                onClick={() => router.push(`/blog/${art.slug}`)}
                dangerouslySetInnerHTML={{
                  __html: art.content
                    .replaceAll("<h1>", "<p>")
                    .replaceAll("</h1>", "</p>"),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
