import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { Search } from "../properties/_components/fillters/search";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "../home.module.css";

export const HomeSearch = () => (
  <section
    className={styles.searchSection}
    aria-labelledby="home-title"
    id="website"
  >
    <div>
      <p className={styles.eyebrow}>PrimePro Indonesia</p>
      <h1 id="home-title" className={styles.display}>
        Temukan properti pilihan Anda
      </h1>
      <p className={styles.intro}>
        Jelajahi rumah, apartemen, tanah, dan properti komersial untuk dijual
        atau disewa. Temukan lokasi yang sesuai, lalu hubungi agen untuk detail
        terbaru.
      </p>
    </div>
    <div className={styles.searchPanel}>
      <label htmlFor="property-search" className={styles.searchLabel}>
        Mulai dari lokasi atau tipe properti
      </label>
      <Search />
      <Link
        href="/properties"
        className={cn(buttonVariants(), styles.searchLink)}
      >
        Lihat semua properti <LuArrowRight aria-hidden="true" />
      </Link>
    </div>
  </section>
);
