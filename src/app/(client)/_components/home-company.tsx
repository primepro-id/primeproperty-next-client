import { Faq } from "../properties/_components/faq";

export const HomeCompany = () => (
  <section
    className="bg-muted py-12 lg:py-20 [&_#faq]:min-w-0 [&_h2]:font-sans [&_h2]:text-[32px] [&_h2]:font-normal [&_iframe]:aspect-video [&_iframe]:h-auto"
    aria-label="Tentang PrimePro dan pertanyaan umum"
  >
    <div className="mx-auto max-w-7xl px-4 md:px-8 [&>div]:my-0">
      <Faq defaultTab="PRIMEPRO" />
    </div>
  </section>
);
