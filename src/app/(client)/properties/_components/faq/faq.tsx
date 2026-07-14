"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaqPrimePro } from "./faq-primepro";
import { FaqProperty } from "./faq-property";
import { FaqSchema } from "./faq-schema";

type FaqProps = {
  defaultTab: "PRIMEPRO" | "PROPERTY";
};

const VideoThumbnail = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-3xl font-bold text-center lg:text-left font-sans">
        Our Company
      </h3>
      <iframe
        width="100%"
        src="https://www.youtube.com/embed/ivN7BfhMv4g?si=zLm4yBwIrF7So1wM"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="h-96 md:h-[400px] lg:h-[600px] rounded-lg"
      />
    </div>
  );
};

export const Faq = ({ defaultTab }: FaqProps) => {
  return (
    <div className="flex flex-col gap-8 lg:grid grid-cols-2">
      <FaqSchema />

      <VideoThumbnail />
      <Tabs defaultValue={defaultTab} className="max-w-xl" id="faq">
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
  );
};
