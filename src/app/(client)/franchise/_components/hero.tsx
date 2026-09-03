import { buttonVariants } from "@/components/ui/button";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

export const Hero = () => {
  const currentUrl = env.NEXT_PUBLIC_HOST_URL + "/franchise";
  const whatsappUrl = new URL("https://api.whatsapp.com/send");
  whatsappUrl.searchParams.append("phone", "628567557979");
  const text = `Hai, saya ingin bertanya-tanya tentang franchise opportunity di: \n${currentUrl}\n Mohon informasinya terkait hal tersebut.`;
  whatsappUrl.searchParams.append("text", text);
  const askUrl = whatsappUrl.toString();
  return (
    <section className="grid items-center gap-8 lg:grid-cols-2 container mx-auto ">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <div className="border rounded text-xs p-1">
          {"✨ Franchise Opportunity"}
        </div>
        <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
          Peluang Franchise dengan PrimePro Indonesia
        </h1>
        <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
          Kembangkan Bisnis Anda dengan Jaringan Properti Terkemuka di Indonesia
        </p>
        <div className="grid gap-2 sm:grid-cols-2 w-full sm:max-w-sm">
          <Link href={askUrl} className={cn(buttonVariants({}))}>
            Mulai Sekarang
            <LuArrowRight />
          </Link>
          <Link
            href={askUrl}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </div>
      <Image
        src="/images/primepro.png"
        alt="PrimePro Indonesia Franchise"
        className="max-h-96 w-full rounded-md object-cover"
        width={512}
        height={512}
      />
    </section>
  );
};
