import { Suspense } from "react";
import { PopularProperties } from "./properties/_components/popular-properties";
import { createSiteIdentitySchema } from "@/lib/schema";
import Loading from "./loading";
import { HomeCampaign } from "./_components/home-campaign";
import { HomeSearch } from "./_components/home-search";
import { HomePartners } from "./_components/home-partners";
import { HomeCompany } from "./_components/home-company";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

const HomePage = () => (
  <div className={styles.home}>
    <script id="website-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createSiteIdentitySchema()).replace(/</g, "\\u003c") }} />
    <HomeCampaign />
    <div className={styles.container}>
      <HomeSearch />
      <div className={styles.sections}>
        <div className={styles.listings}>
          <Suspense fallback={<Loading />}><PopularProperties /></Suspense>
        </div>
        <HomePartners />
      </div>
    </div>
    <HomeCompany />
  </div>
);
export default HomePage;
