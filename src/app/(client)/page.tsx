import { Suspense } from "react";
import { PopularProperties } from "./properties/_components/popular-properties";
import { createSiteIdentitySchema } from "@/lib/schema";
import Loading from "./loading";
import { HomeCampaign } from "./_components/home-campaign";
import { HomeSearch } from "./_components/home-search";
import { HomePartners } from "./_components/home-partners";
import { HomeCompany } from "./_components/home-company";

export const dynamic = "force-dynamic";

const HomePage = () => (
  <div className="bg-background text-foreground [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-ring [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-ring">
    <script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(createSiteIdentitySchema()).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
    <HomeCampaign />
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <HomeSearch />
      <div className="flex flex-col gap-12 py-12 lg:gap-20 lg:py-20">
        <div className="empty:hidden [&_h3]:font-sans [&_h3]:text-[clamp(28px,3vw,36px)] [&_h3]:font-normal">
          <Suspense fallback={<Loading />}>
            <PopularProperties />
          </Suspense>
        </div>
        <HomePartners />
      </div>
    </div>
    <HomeCompany />
  </div>
);
export default HomePage;
