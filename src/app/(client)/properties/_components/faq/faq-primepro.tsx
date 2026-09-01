import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PRIMEPRO_FAQ_SECTIONS,
  type FaqItem,
} from "./faq-content";

const renderFaqAnswer = (faq: FaqItem) => {
  if (faq.items) {
    return (
      <ul className="ml-6 list-disc [&>li]:mt-2">
        {faq.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (faq.paragraphs) {
    return faq.paragraphs.map((paragraph) => (
      <p key={paragraph}>{paragraph}</p>
    ));
  }

  return faq.answer;
};

const FaqSection = ({ sectionIndex }: { sectionIndex: number }) => {
  const section = PRIMEPRO_FAQ_SECTIONS[sectionIndex];

  return (
    <div className="flex flex-col">
      <p className="font-semibold border-b">{section.title}</p>
      <Accordion className="w-full">
        {section.items.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="font-sans">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="border-b">
              {renderFaqAnswer(faq)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export const FaqPrimePro = () => {
  return (
    <div className="flex flex-col gap-8">
      {PRIMEPRO_FAQ_SECTIONS.map((section, index) => (
        <FaqSection key={section.title} sectionIndex={index} />
      ))}
    </div>
  );
};
