import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { Banner } from "@/components/custom-ui/banner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "../home.module.css";

export const HomeCampaign = () => (
  <section aria-label="Princess Cove, Malaysia" className={styles.campaign}>
    <div className={styles.container}>
      <Banner variant="home" priority />
      <div className={styles.campaignCaption}>
        <div>
          <p className={styles.eyebrow}>Properti pilihan</p>
          <p className={styles.campaignTitle}>Princess Cove, Malaysia</p>
        </div>
        <Link
          href="/properties/677"
          className={cn(
            buttonVariants({ variant: "outline" }),
            styles.campaignLink,
          )}
        >
          Lihat Princess Cove <LuArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);
