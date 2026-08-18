import { Metadata } from "next";
import { Faq } from "../_components/faq";
import { BookmarkedProperties } from "./_components/bookmarked-properties";
import { createMetadata } from "@/lib/metadata";

const seo = {
  title: "Bandingkan Jual Beli Rumah Apartemen | PRIMEPRO INDONESIA",
  description:
    "Cari dan Bandingkan  properti secara online mudah aman sekaligus cepat, hanya di PrimePro Indonesia",
  keywords:
    "PrimePro Indonesia, Properti, Properti Prime, Properti Jakarta Selatan",
  path: "/properties/bookmark",
};
export const metadata: Metadata = createMetadata(seo);

export default function Page() {
  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4 min-h-screen">
        <div>
          <h1 className="text-xl font-bold">Perbandingan Properti</h1>
          <h3 className="text-muted-foreground">
            Pilih 2 properti, klik &quot;COMPARE&quot;, lalu klik
            &quot;LANJUTKAN&quot; untuk penelusuran
          </h3>
        </div>

        <BookmarkedProperties />
      </div>

      <Faq defaultTab="PROPERTY" />
    </div>
  );
}
