import Link from "next/link";
import { LoginForm } from "./_components";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center container mx-auto">
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/images/primepro.png"
          alt="PRIMEPRO INDONESIA"
          width={100}
          height={100}
        />
        <h1 className="text-xl font-bold">Welcome to PRIMEPRO INDONESIA</h1>
      </div>
      <LoginForm />

      <Link
        href="/auth/forgot-password"
        className="underline underline-offset-4 text-xs"
      >
        I forgot my password
      </Link>
    </div>
  );
};

export default LoginPage;
