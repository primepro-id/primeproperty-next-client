import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { SendEmailForm } from "./send-email-form";
export const SendEmailCard = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SendEmailForm />
      </CardContent>
      <CardFooter>
        <Link
          href="/auth"
          className="flex items-center gap-2 underline underline-offset-4 text-sm"
        >
          <LuArrowLeft />
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
};
