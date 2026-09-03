import { Metadata } from "next";
import { Footer } from "./_footer";
import { Header } from "./_header";
import { createMetadata } from "@/lib/metadata";
import { GoogleAnalytics } from "@next/third-parties/google";
import { env } from "@/lib/env";
import { getPublicPropertyNavigation } from "./_lib/get-public-property-navigation";

const seo = {
  title: "Jual Beli Rumah Apartemen | PRIMEPRO INDONESIA",
  description:
    "Cari jual dan beli properti secara online mudah aman sekaligus cepat, hanya di PrimePro Indonesia",
  path: "/",
};
export const metadata: Metadata = createMetadata(seo);

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {
  const navigations = await getPublicPropertyNavigation();

  return (
    <>
      <Header navigations={navigations} />
      <main className="min-h-screen">{children}</main>
      <Footer navigations={navigations} />
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
    </>
  );
};

export default ClientLayout;
