import { Metadata } from "next";
import { env } from "@/lib/env";
import { generateBlogHomeSchema } from "./_lib/generate-blog-home-schema";
import Image from "next/image";
import { AllArticles, Latest, Spotlight } from "./_components";
import { PopularProperties } from "../properties/_components";
import { findArticles } from "@/lib/api";

export const revalidate = 0

const title = "Tips dan Trik Pemilihan Properti | PrimePro Indonesia";
const description =
  "Artikel Primepro Indonesia menyuguhkan tips dan trik terkini seputar properti dan ulasan mengenai rumah hingga gaya hidup";
export const metadata: Metadata = {
  title,
  description,
  twitter: {
    title,
    site: "@primeproindonesia",
    creator: "@primeproindonesia",
    card: "summary_large_image",
    images: [`${env.NEXT_PUBLIC_HOST_URL}/images/primepro.png`],
  },
  openGraph: {
    title,
    description,
    siteName: "Primepro Indonesia",
    locale: "id_ID",
  },
  appleWebApp: true,
  applicationName: "Primepro Indonesia",
  robots: "index, follow",
  alternates: {
    canonical: `${env.NEXT_PUBLIC_HOST_URL}/blog`,
  },
};

const Blog = async () => {
  const { allArticles } = await findArticles();
  const { homeSchema, breadcrumbSchema } = generateBlogHomeSchema(allArticles);

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
        <div className="md:grid grid-cols-2 gap-16 flex flex-col">
          <Spotlight article={allArticles[0]} />
          <Latest articles={allArticles.slice(1, 4)} />
        </div>
        <AllArticles articles={allArticles.slice(4, allArticles.length)} />
        <PopularProperties />
      </section>
    </>
  );
};

export default Blog;
