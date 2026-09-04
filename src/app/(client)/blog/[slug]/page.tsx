import { generateBlogMetadata } from "../_lib/generate-blog-metadata";
import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/(client)/loading";
import { BlogPageContent } from "./_components/blog-page-content";

export const revalidate = 0;

type BlogSlugProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: BlogSlugProps): Promise<Metadata> => generateBlogMetadata(params);

const BlogSlug = ({ params }: BlogSlugProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <BlogPageContent params={params} />
    </Suspense>
  );
};

export default BlogSlug;
