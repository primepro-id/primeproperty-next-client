import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

export const AdminNavbar = () => {
  return (
    <div className="p-2 border-b flex items-center justify-between sm:hidden w-full">
      <Link href="/admin">
        <Image
        src="/images/primepro.png"
        alt="PRIMEPRO INDONESIA"
        width={100}
        height={100}
        className="size-6"
        />
      </Link>
      <SidebarTrigger />
    </div>
  )
}
