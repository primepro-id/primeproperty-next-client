import { Metadata } from "next";
import { env } from "../env";
import { createSeoMetadataFields } from "./seo-domain";

type MetadataParams = {
  title: string;
  description: string;
  path: string;
  image?: string;
  index?: boolean;
};

export const createMetadata = ({
  title,
  description,
  path,
  image = `${env.NEXT_PUBLIC_HOST_URL}/images/primepro.png`,
  index = true,
}: MetadataParams): Metadata => {
  return createSeoMetadataFields({
    hostUrl: env.NEXT_PUBLIC_HOST_URL,
    title,
    description,
    path,
    image,
    index,
  });
};
