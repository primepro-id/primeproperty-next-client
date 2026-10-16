"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFaqSchema } from "@/lib/schema";
import { ALL_FAQ_ITEMS } from "./faq-content";
import { FaqPrimePro } from "./faq-primepro";
import { FaqProperty } from "./faq-property";
import { VideoThumbnail } from "./video-thumbnail";

type FaqProps = {
  defaultTab: "PRIMEPRO" | "PROPERTY";
};

export const Faq = ({ defaultTab }: FaqProps) => {
  const faqSchema = createFaqSchema(ALL_FAQ_ITEMS);

  return (
    <>
      <script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex flex-col gap-8 lg:grid grid-cols-2 my-16 lg:gap-16">
        <VideoThumbnail />
        <Tabs
          defaultValue={defaultTab}
          className="max-w-xl lg:max-w-none"
          id="faq"
        >
          <TabsList className="border-b">
            <TabsTrigger
              value="PRIMEPRO"
              className="data-[state=active]:font-bold font-sans"
            >
              FAQ UMUM
            </TabsTrigger>
            <TabsTrigger
              value="PROPERTY"
              className="data-[state=active]:font-bold font-sans"
            >
              FAQ PROPERTI
            </TabsTrigger>
          </TabsList>
          <TabsContent value="PRIMEPRO">
            <FaqPrimePro />
          </TabsContent>
          <TabsContent value="PROPERTY">
            <FaqProperty />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
