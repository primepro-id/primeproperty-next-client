import { buttonVariants } from "@/components/ui/button";
import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type BlogPostProps = {
  article: Article;
};

export const BlogPost = ({ article }: BlogPostProps) => {
  return (
    <section id="article" className="flex flex-col gap-4 max-w-5xl">
      <div className="hidden lg:flex items-center ">
        <Link
          href="/"
          title="Primepro Indonesia"
          className={cn(
            buttonVariants({ variant: "link" }),
            "pl-0 text-muted-foreground",
          )}
        >
          Primepro
        </Link>
        <LuChevronRight />
        <Link
          href="/blog"
          title="Primepro Indonesia"
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-muted-foreground",
          )}
        >
          Blog
        </Link>
        <LuChevronRight />
        <Link
          href={`/blog/${article.slug}`}
          title="Primepro Indonesia"
          className={cn(
            buttonVariants({ variant: "link" }),

            "text-muted-foreground",
          )}
        >
          {article.title}
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-pretty text-3xl font-semibold">{article.title}</h1>
        <p className="text-muted-foreground text-sm">
          {new Date(article._publishedAt).toLocaleString()}
        </p>
      </div>

      <div
        className={cn(
          "font-sans",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-4",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-4",
          "[&_ol]:list-decimal [&_ul]:list-disc [&_ul]:list-inside whitespace-normal [&_ol]:mb-4 [&_ul]:mb-4",
          "[&_p]:mb-4",
          "[&_img]:rounded",
          "[&_a]:underline",
        )}
        dangerouslySetInnerHTML={{
          __html: article.content
            .replaceAll("<h1>", "<p>")
            .replaceAll("</h1>", "</p>"),
        }}
      />

      <Link
        href="/blog"
        title="PrimePro Blog"
        aria-label="PrimePro Blog"
        className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
      >
        <LuChevronLeft />
        Semua Artikel
      </Link>
    </section>
  );
};
