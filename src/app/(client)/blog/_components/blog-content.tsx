import { findPropertyJoinAgent } from "@/lib/api";
import { findArticles } from "@/lib/api/articles";
import { PopularProperties } from "../../properties/_components";
import { AllArticles } from "./all-articles";
import { Latest } from "./latest";
import { Spotlight } from "./spotlight";

export const BlogContent = async () => {
  const [{ allArticles }, popularPropertiesResponse] = await Promise.all([
    findArticles(),
    findPropertyJoinAgent({ is_popular: true }),
  ]);

  return (
    <>
      <div className="md:grid grid-cols-2 gap-16 flex flex-col">
        <Spotlight article={allArticles[0]} />
        <Latest articles={allArticles.slice(1, 4)} />
      </div>
      <AllArticles articles={allArticles.slice(4, allArticles.length)} />
      <PopularProperties
        properties={popularPropertiesResponse.data?.data ?? []}
      />
    </>
  );
};
