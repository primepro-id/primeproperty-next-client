import Image from "next/image";
import { DEVELOPERS } from "@/lib/developers";
import { env } from "@/lib/env";
import styles from "../home.module.css";

const BANKS = [
  { name: "BCA", file: "bca.png" },
  { name: "BNI", file: "bni.png" },
  { name: "BRI", file: "bri.png" },
  { name: "BSI", file: "bsi.png" },
  { name: "Mandiri", file: "mandiri.webp" },
  { name: "CIMB Niaga", file: "cimb.png" },
  { name: "OCBC", file: "ocbc.png" },
  { name: "Panin Bank", file: "panin.png" },
  { name: "PermataBank", file: "permata.png" },
  { name: "Danamon", file: "danamon.webp" },
  { name: "Maybank", file: "maybank.png" },
  { name: "SMBC Indonesia", file: "smbc.png" },
];

export const HomePartners = () => (
  <section aria-labelledby="partners-title" className={styles.partners}>
    <div className={styles.sectionHeading}>
      <p className={styles.eyebrow}>Rekanan kami</p>
      <h2 id="partners-title" className={styles.display}>
        Bank dan developer rekanan
      </h2>
    </div>
    <ul className={styles.partnerGrid}>
      {[
        ...BANKS.map((bank) => ({
          name: bank.name,
          src: `/images/banks/${bank.file}`,
        })),
        ...DEVELOPERS.map((developer) => ({
          name: developer.name,
          src: env.NEXT_PUBLIC_S3_ENDPOINT + developer.logo_path,
        })),
      ].map((partner) => (
        <li key={partner.name} className={styles.partnerTile}>
          <Image
            src={partner.src}
            alt={partner.name}
            width={160}
            height={80}
            sizes="(min-width: 768px) 160px, 100px"
            className="h-16 w-full object-contain"
          />
        </li>
      ))}
    </ul>
  </section>
);
