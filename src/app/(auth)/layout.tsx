import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const seo = {
  title: "Jual Beli Rumah Apartemen | PRIMEPRO INDONESIA",
  description:
    "Cari jual dan beli properti secara online mudah aman sekaligus cepat, hanya di PrimePro Indonesia",
  path: "/auth",
  index: false,
};
export const metadata: Metadata = {
  ...createMetadata(seo),
  robots: { index: false, follow: false },
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default AuthLayout;
