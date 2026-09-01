import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin/_components/sidebar";
import { AdminNavbar } from "./admin/_components/navbar";

const seo = {
  title: "Jual Beli Rumah Apartemen | PRIMEPRO INDONESIA",
  description:
    "Cari jual dan beli properti secara online mudah aman sekaligus cepat, hanya di PrimePro Indonesia",
  path: "/admin",
  index: false,
};
export const metadata: Metadata = {
  ...createMetadata(seo),
  robots: { index: false, follow: false },
};

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider className="h-svh min-h-0 overflow-hidden">
        <AdminSidebar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <AdminNavbar />
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-2">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default ClientLayout;
