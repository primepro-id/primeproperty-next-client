import { Properties } from "./_components";
import { FindPropertyQuery } from "@/lib/api";
import { Metadata } from "next";
import { generatePropertiesMetadata } from "./_lib/create-properties-metadata";

export const revalidate = 0;

type PropertiesPageProps = {
  searchParams: Promise<FindPropertyQuery>;
};

export const generateMetadata = async ({
  searchParams,
}: PropertiesPageProps): Promise<Metadata> =>
  generatePropertiesMetadata(searchParams);

const PropertiesPage = async ({ searchParams }: PropertiesPageProps) => {
  const searchQuery = await searchParams;
  return (
      <Properties searchParams={searchQuery} />
  );
};

export default PropertiesPage;
