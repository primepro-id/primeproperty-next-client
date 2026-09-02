import { buttonVariants } from "@/components/ui/button";
import { createMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LuArrowRight,
  LuAward,
  LuDollarSign,
  LuMail,
  LuMapPin,
  LuUsers,
  LuWorkflow,
} from "react-icons/lu";

const Hero = () => {
  return (
    <div className="bg-primary text-primary-foreground px-4 py-8">
      <div className="container mx-auto grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4 items-start justify-center">
          <h1 className="text-balance text-4xl font-medium lg:text-5xl">
            Peluang Karir: Marketing Executive
          </h1>
          <p className="text-lg text-primary-foreground/75">
            PrimePro Indonesia, sebuah perusahaan broker properti yang dinamis
            dan terus berkembang, sedang memperluas timnya dan mencari individu
            yang termotivasi tinggi untuk bergabung sebagai Marketing Executive.
            Jika Anda seorang profesional yang mandiri, berorientasi pada hasil,
            dan memiliki visi untuk sukses, kami mengundang Anda untuk
            menjelajahi peluang menarik ini.
          </p>

          <Link
            href="mailto:primeproagent@gmail.com"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Kirim Lamaran Sekarang
          </Link>
        </div>

        <Image
          src="/images/primepro/agent.JPG"
          alt="Real Estate Team"
          width={256}
          height={256}
          className="object-cover rounded aspect-[2/3] mx-auto"
        />
      </div>
    </div>
  );
};

const WhyJoin = () => {
  return (
    <section className="container mx-auto px-4 pt-24 pb-8">
      <div>
        <h2 className="text-foreground text-4xl font-semibold text-center">
          Mengapa Bergabung dengan PrimePro Indonesia?
        </h2>
        <p className="text-muted-foreground mb-12 mt-4 text-xl mx-auto max-w-5xl">
          Di PrimePro Indonesia, kami percaya dalam menghargai ambisi dan kerja
          keras. Sebagai posisi berbasis komisi, peran ini menawarkan potensi
          penghasilan tak terbatas, memungkinkan Anda mengendalikan sepenuhnya
          pertumbuhan finansial Anda. Manfaat utama meliputi:
        </p>
      </div>

      <div className="sm:grid-cols-2 md:grid-cols-4 my-12 grid gap-6">
        <div className="space-y-2">
          <LuDollarSign className="text-3xl mb-4 text-green-500" />
          <h3 className="text-xl font-medium">
            Struktur Komisi yang Sangat Kompetitif
          </h3>
          <p className="text-muted-foreground">
            Dapatkan komisi besar untuk setiap transaksi sukses, tanpa batas
            gaji tetap.
          </p>
        </div>
        <div className="space-y-2">
          <LuAward className="text-3xl mb-4 text-yellow-500" />
          <h3 className="text-xl font-medium">Insentif Berbasis Kinerja</h3>
          <p className="text-muted-foreground">
            Capai target Anda dan dapatkan bonus perjalanan eksklusif serta
            penghargaan lainnya.
          </p>
        </div>
        <div className="space-y-2">
          <LuUsers className="text-3xl mb-4 text-primary" />
          <h3 className="text-xl font-medium">
            Program Pelatihan Komprehensif
          </h3>
          <p className="text-muted-foreground">
            Dapatkan pelatihan terbaik di industri untuk meningkatkan
            pengetahuan Anda.
          </p>
        </div>
        <div className="space-y-2">
          <LuWorkflow className="text-3xl mb-4 text-red-500" />
          <h3 className="text-xl font-medium">Jalur Karir yang Fleksibel</h3>
          <p className="text-muted-foreground">
            Terbuka untuk semua latar belakang dan kelompok usia.
          </p>
        </div>
      </div>
    </section>
  );
};

const Quality = () => {
  return (
    <section className="mx-auto container px-4 py-8">
      <div>
        <h2 className="text-2xl font-semibold">Kualitas yang Kami Cari</h2>
        <p className="text-muted-foreground mt-4 text-balance text-lg">
          Kami mencari individu yang mencerminkan kualitas berikut:
        </p>
      </div>
      <ul role="list" className="text-muted-foreground mt-8 space-y-2">
        {[
          {
            bold: "Mandiri & Termotivasi:",
            normal: "Kemampuan bekerja secara mandiri sambil mencapai hasil",
          },
          {
            bold: "Berorientasi Target:",
            normal:
              "Keinginan kuat untuk memenuhi dan melampaui tujuan penjualan.",
          },
          {
            bold: "Visioner & Ambisius:",
            normal: "Bersemangat membangun karir sukses di bidang properti.",
          },
          {
            bold: "Keterampilan Komunikasi yang Baik:",
            normal:
              "Percaya diri dalam berinteraksi dengan klien dan menutup kesepakatan.",
          },
        ].map((quality, index) => (
          <li
            key={`quality-${index}`}
            className="-ml-0.5 flex flex-wrap items-center gap-1.5"
          >
            <LuArrowRight className="size-4 text-foreground" />
            <span className="text-foreground font-medium">{quality.bold}</span>
            {quality.normal}
          </li>
        ))}
      </ul>
    </section>
  );
};

const Role = () => {
  return (
    <section className="mx-auto container px-4 pt-8 pb-24 text-right">
      <div>
        <h2 className="text-2xl font-semibold">
          Peran Anda sebagai Marketing Executive
        </h2>
        <p className="text-muted-foreground mt-4 text-balance text-lg">
          Sebagai anggota kunci tim penjualan kami, Anda akan:
        </p>
      </div>
      <ul role="list" className="text-muted-foreground mt-8 space-y-2">
        {[
          "Secara proaktif menghasilkan prospek dan mengubahnya menjadi transaksi properti yang sukses.",
          "Membangun dan memelihara hubungan klien yang kuat.",
          "Tetap update dengan tren pasar untuk memberikan rekomendasi yang informatif.",
          "Bekerja sama dengan tim PrimePro Indonesia untuk mencapai target kolektif dan individu.",
        ].map((role, index) => (
          <li
            key={`role-${index}`}
            className="flex flex-wrap items-center md:justify-end gap-1.5"
          >
            <LuArrowRight className="size-4 text-foreground" />
            {role}
          </li>
        ))}
      </ul>
    </section>
  );
};

const CtaSection = () => {
  return (
    <section className="bg-muted py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-foreground max-w-lg text-balance text-3xl font-semibold lg:text-4xl">
          <span className="text-muted-foreground">Cara Mendaftar</span>
        </h2>
        <p className="mt-4 text-lg">
          Jika Anda siap mengambil langkah berikutnya dalam karir Anda, kirimkan
          CV/resume Anda ke:
        </p>
        <div className="my-8 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <LuMail className="h-5 w-5" />
            <Link
              title="Email"
              aria-label="Email"
              href="mailto:primeproagent@gmail.com"
              className="hover:underline"
            >
              primeproagent@gmail.com
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LuMapPin className="h-5 w-5" />
            <span>
              Jl Pakubuwono VI No. 35, Kebayoran Baru, Jakarta Selatan 12120
            </span>
          </div>
        </div>
        <Link
          href="mailto:primeproagent@gmail.com"
          className={cn(buttonVariants({}))}
        >
          Kirim Lamaran Sekarang
        </Link>
      </div>
    </section>
  );
};

export const metadata: Metadata = createMetadata({
  title: "Peluang Karir: Marketing Executive - PRIMEPRO INDONESIA",
  description:
    "PrimePro Indonesia sedang memperluas timnya dan mencari individu yang termotivasi tinggi untuk bergabung sebagai Marketing Executive.",
  path: "/jobs",
});

export default function JobsPage() {
  return (
    <div>
      <Hero />
      <WhyJoin />
      <Quality />
      <Role />
      <CtaSection />
    </div>
  );
}
