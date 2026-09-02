import { Metadata } from "next";
import { Footer } from "./_footer";
import { Header } from "./_header";
import { createMetadata } from "@/lib/metadata";
import { GoogleAnalytics } from "@next/third-parties/google";
import { env } from "@/lib/env";

const seo = {
  title: "Jual Beli Rumah Apartemen | PRIMEPRO INDONESIA",
  description:
    "Cari jual dan beli properti secara online mudah aman sekaligus cepat, hanya di PrimePro Indonesia",
  path: "/",
};
export const metadata: Metadata = createMetadata(seo);

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
    </>
  );
};

export default ClientLayout;
