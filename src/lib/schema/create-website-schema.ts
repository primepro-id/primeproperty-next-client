import { env } from "../env";

export const createWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${env.NEXT_PUBLIC_HOST_URL}/#website`,
    description:
      "Your private key to exceptional properties. Jual dan beli properti secara online dengan layanan terbaik di PrimePro Indonesia.",
    inLanguage: "id-ID",
    name: "PrimePro Indonesia",
    url: env.NEXT_PUBLIC_HOST_URL,
  };
};
