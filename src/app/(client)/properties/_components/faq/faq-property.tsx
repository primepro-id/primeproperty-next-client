import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PROPERTY_FAQ_ITEMS } from "./faq-content";

export const FaqProperty = () => {
  return (
    <Accordion className="w-full">
      {PROPERTY_FAQ_ITEMS.map((faq, index) => (
        <AccordionItem key={faq.question} value={faq.question}>
          <AccordionTrigger className="font-sans">
            {index + 1} {faq.question}
          </AccordionTrigger>
          <AccordionContent className="border-b">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
