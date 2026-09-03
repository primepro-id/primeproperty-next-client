import { env } from "@/lib/env";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LuArrowRight } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Article } from "@/lib/types";
import { createArticleExcerpt } from "../_lib/create-article-excerpt";

type SpotlightProps = {
  article: Article;
};

export const Spotlight = ({ article }: SpotlightProps) => {
  return (
    <div className="border border-primary md:border-transparent rounded-lg ">
      <div className=" px-4 py-1 md:hidden">Tips &amp; Trick Spotlight</div>

      <Link title={article.title} href={`/blog/${article.slug}`}>
        <Image
          src={article.thumbnail.url}
          alt={article.seo.title}
          title={article.seo.title}
          width={1024}
          height={1024}
          className="w-full h-48 md:h-64  object-cover aspect-square border-y border-y-primary md:border-transparent md:rounded-lg"
          priority
        />
      </Link>

      <div className="p-4 flex flex-col gap-2 md:px-0">
        <p className="text-muted-foreground text-sm">
          {new Date(article._updatedAt).toLocaleString("id-ID")}
        </p>
        <Link
          title={article.title}
          href={`/blog/${article.slug}`}
          className="font-bold text-xl md:text-2xl hover:underline"
        >
          {article.title}
        </Link>

        <Link href={`/blog/${article.slug}`} title={article.title}>
          <p className="line-clamp-3 text-muted-foreground text-sm hover:underline">
            {createArticleExcerpt(article.content)}
          </p>
        </Link>

        <Link
          title={article.title}
          className={cn(buttonVariants(), "w-fit ml-auto")}
          href={`${env.NEXT_PUBLIC_HOST_URL}/blog/${article.slug}`}
        >
          Telusuri <LuArrowRight />
        </Link>
      </div>
    </div>
  );
};
