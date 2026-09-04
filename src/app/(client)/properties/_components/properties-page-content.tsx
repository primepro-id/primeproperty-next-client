import type { FindPropertyQuery } from "@/lib/api";
import { Properties } from "./properties";

type PropertiesPageContentProps = {
  searchParams: Promise<FindPropertyQuery>;
};

export const PropertiesPageContent = async ({
  searchParams,
}: PropertiesPageContentProps) => {
  const searchQuery = await searchParams;

  return <Properties searchParams={searchQuery} />;
};
