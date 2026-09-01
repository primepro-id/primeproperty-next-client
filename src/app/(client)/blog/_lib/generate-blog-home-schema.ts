import { env } from "@/lib/env";

export const generateBlogHomeSchema = () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${env.NEXT_PUBLIC_HOST_URL}/blog`,
    name: "Tips dan Trik Pemilihan Properti | PrimePro Indonesia",
    description:
      "Artikel Primepro Indonesia menyuguhkan tips dan trik terkini seputar properti dan ulasan mengenai rumah hingga gaya hidup",
    thumbnailUrl: `${env.NEXT_PUBLIC_HOST_URL}/images/primepro-with-full-text.png`,
    isPartOf: {
      "@type": "WebSite",
      url: env.NEXT_PUBLIC_HOST_URL,
      name: "Primepro Indonesia Blog",
    },
    author: {
      "@type": "Organization",
      name: "PrimePro Indonesia",
      url: env.NEXT_PUBLIC_HOST_URL,
    },
    image: {
      "@type": "ImageObject",
      url: `${env.NEXT_PUBLIC_HOST_URL}/images/primepro-with-full-text.png`,
    },
    publisher: {
      "@type": "Organization",
      name: "PrimePro Indonesia",
      logo: {
        "@type": "ImageObject",
        url: `${env.NEXT_PUBLIC_HOST_URL}/images/primepro-with-full-text.png`,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: env.NEXT_PUBLIC_HOST_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${env.NEXT_PUBLIC_HOST_URL}/blog`,
      },
    ],
  };
  return { homeSchema, breadcrumbSchema };
};
