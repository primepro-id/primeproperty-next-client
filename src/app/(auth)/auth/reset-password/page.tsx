import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResetPasswordForm } from "./_components";

type ResetPasswodPageProps = {
  searchParams: Promise<{
    t?: string;
  }>;
};

const ResetPasswodPage = async ({ searchParams }: ResetPasswodPageProps) => {
  const { t } = await searchParams;
  return (
    <div className="container mx-auto h-screen px-4 md:px-0 flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold text-center ">Reset Your Password</h1>
      <Suspense fallback={<Skeleton className="max-w-md w-full h-48" />}>
        <ResetPasswordForm token={t} />
      </Suspense>
      <div className="text-center">
        <Link
          href="/auth"
          className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
        >
          Return to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswodPage;
