import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const TokenExpiredCard = () => {
  return (
    <Card className="w-full max-w-md bg-red-100">
      <CardHeader>
        <CardTitle>Password Reset Link Expired</CardTitle>
        <CardDescription>
          The password reset link you clicked has expired or is invalid. Reset
          links are typically valid for 1 hour after they are requested.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link className={cn(buttonVariants())} href="/auth/forgot-password">
          Request New Reset Link
        </Link>
      </CardFooter>
    </Card>
  );
};
