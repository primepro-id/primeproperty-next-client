import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin/_components/sidebar";
import { AdminNavbar } from "./admin/_components/navbar";

const seo = {
  title: "Jual Beli Rumah Apartemen | PRIMEPRO INDONESIA",
  description:
    "Cari jual dan beli properti secara online mudah aman sekaligus cepat, hanya di PrimePro Indonesia",
  keywords:
    "PrimePro Indonesia, Properti, Properti Prime, Properti Jakarta Selatan",
  path: "/",
};
export const metadata: Metadata = createMetadata(seo);

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <main className="h-screen overflow-y-auto flex flex-col w-full">
          <AdminNavbar />
          <div className="p-2 flex-1">{children}</div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default ClientLayout;
