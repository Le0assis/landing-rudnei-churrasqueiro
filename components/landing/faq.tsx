import { SectionHeading } from "@/components/landing/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/content/site";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl">
        <SectionHeading
          eyebrow="Perguntas"
          title="Dúvidas comuns"
          intro="Se a sua dúvida não estiver aqui, é só me chamar no WhatsApp."
        />
        <Accordion multiple className="mt-8 gap-3">
          {faqs.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="rounded-2xl border border-cream/10 bg-ink-2 px-4"
            >
              <AccordionTrigger className="py-4 text-left text-base text-cream hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-cream-dim">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
