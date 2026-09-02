import { env } from "@/lib/env";

type FaqSchemaItem = {
  question: string;
  answer?: string;
  paragraphs?: string[];
  items?: string[];
};

export const createFaqSchema = (items: FaqSchemaItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${env.NEXT_PUBLIC_HOST_URL}/#faq`,
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: [item.answer, ...(item.paragraphs ?? []), ...(item.items ?? [])]
        .filter(Boolean)
        .join(" "),
    },
  })),
});
