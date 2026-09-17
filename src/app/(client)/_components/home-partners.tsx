import Image from "next/image";
import { DEVELOPERS } from "@/lib/developers";
import { env } from "@/lib/env";

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
  <section aria-labelledby="partners-title">
    <div className="mb-7">
      <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em]">
        Rekanan kami
      </p>
      <h2
        id="partners-title"
        className="text-balance font-sans text-[clamp(28px,3vw,36px)] font-normal leading-[1.15]"
      >
        Bank dan Developer Rekanan
      </h2>
    </div>
    <ul className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
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
        <li
          key={partner.name}
          className="flex min-w-0 items-center justify-center rounded-md border border-border bg-white p-3 md:p-5"
        >
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
