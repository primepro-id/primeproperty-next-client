import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";

type PropertySectionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function PropertySectionCard({
  title,
  description,
  children,
  className,
}: PropertySectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
