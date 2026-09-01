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
    publisher: {
      "@id": `${env.NEXT_PUBLIC_HOST_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${env.NEXT_PUBLIC_HOST_URL}/properties?keyword={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
};
