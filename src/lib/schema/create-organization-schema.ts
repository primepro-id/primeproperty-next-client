import { env } from "../env";

export const createOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    "@id": `${env.NEXT_PUBLIC_HOST_URL}/#organization`,
    description:
      "Your private key to exceptional properties. Jual dan beli properti secara online dengan layanan terbaik di PrimePro Indonesia.",
    email: "primeproagent@gmail.com",
    legalName: "PT. Prima Berkat Propertindo",
    name: "Primepro Indonesia",
    sameAs: [
      "https://www.facebook.com/PrimePro-Indonesia",
      "https://www.instagram.com/primepro_id/",
      "https://www.linkedin.com/company/primepro-indonesia/",
      "https://www.youtube.com/@primeproindonesia",
    ],
    slogan: "Your private key to exceptional properties",
    telephone: "0821-1616-2995",
    url: env.NEXT_PUBLIC_HOST_URL,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+62-821-1616-2995",
      email: "primeproagent@gmail.com",
      availableLanguage: "Indonesian",
      areaServed: "ID",
    },
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl Pakubuwono VI No. 35",
      addressLocality: "Kebayoran Baru, Jakarta Selatan",
      addressRegion: "DKI Jakarta",
      postalCode: "12120",
      addressCountry: {
        "@type": "Country",
        name: "ID",
      },
    },
    logo: {
      "@type": "ImageObject",
      "@id": `${env.NEXT_PUBLIC_HOST_URL}/#logo`,
      url: `${env.NEXT_PUBLIC_HOST_URL}/images/primepro-with-full-text.png`,
      width: 512,
      height: 512,
    },
  };
};
