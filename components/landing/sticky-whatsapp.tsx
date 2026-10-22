import { WhatsAppIcon } from "@/components/landing/icons";
import { generalWhatsAppUrl } from "@/lib/quote";

export function StickyWhatsapp() {
  const href = generalWhatsAppUrl();
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/15 bg-ink/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-flame font-semibold text-ink"
          aria-label="WhatsApp fixo no celular"
        >
          <WhatsAppIcon className="size-5" />
          Chamar no WhatsApp
        </a>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 z-40 hidden h-14 items-center gap-2 rounded-full bg-flame px-5 font-semibold text-ink shadow-[0_12px_40px_rgba(255,90,31,0.35)] md:inline-flex"
        aria-label="WhatsApp flutuante"
      >
        <WhatsAppIcon className="size-5" />
        WhatsApp
      </a>
    </>
  );
}
