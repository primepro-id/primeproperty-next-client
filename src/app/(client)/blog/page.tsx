import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { generateBlogHomeSchema } from "./_lib/generate-blog-home-schema";
import Image from "next/image";
import { Suspense } from "react";
import Loading from "@/app/(client)/loading";
import { BlogContent } from "./_components/blog-content";

export const revalidate = 0;

const title = "Tips dan Trik Pemilihan Properti | PrimePro Indonesia";
const description =
  "Artikel Primepro Indonesia menyuguhkan tips dan trik terkini seputar properti dan ulasan mengenai rumah hingga gaya hidup";
export const metadata: Metadata = createMetadata({
  title,
  description,
  path: "/blog",
});

const Blog = () => {
  const { homeSchema, breadcrumbSchema } = generateBlogHomeSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="p-4 container mx-auto font-sans flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Image
            src="/images/primepro.png"
            alt="PrimePro Logo"
            width={400}
            height={400}
            className="size-24"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">PrimePro Indonesia Blog</h1>
            <h2 className="text-muted-foreground max-w-xl">
              Temukan tips dan trik properti terkini seputar properti dan ulasan
              mengenai rumah hingga gaya hidup dari PrimePro Indonesia
            </h2>
          </div>
        </div>
        <Suspense fallback={<Loading />}>
          <BlogContent />
        </Suspense>
      </section>
    </>
  );
};

export default Blog;
