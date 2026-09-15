import { Faq } from "../properties/_components/faq";
import styles from "../home.module.css";

export const HomeCompany = () => (
  <section
    className={styles.company}
    aria-label="Tentang PrimePro dan pertanyaan umum"
  >
    <div className={styles.container}>
      <Faq defaultTab="PRIMEPRO" />
    </div>
  </section>
);
