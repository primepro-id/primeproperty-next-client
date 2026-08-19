import { Metadata } from "next";

const seo = {
  title: "Jual Beli Rumah Apartemen | PRIMEPRO INDONESIA",
  description:
    "Cari jual dan beli properti secara online mudah aman sekaligus cepat, hanya di PrimePro Indonesia",
  keywords:
    "PrimePro Indonesia, Properti, Properti Prime, Properti Jakarta Selatan",
  path: "/",
};
export const metadata: Metadata = seo;

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default AuthLayout;
