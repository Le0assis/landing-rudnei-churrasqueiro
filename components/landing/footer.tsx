import { InstagramIcon } from "@/components/landing/icons";
import { Seal, Wordmark } from "@/components/landing/logo";
import { privacy, slogans } from "@/content/site";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PARTNER_NAME,
  WHATSAPP_DISPLAY,
} from "@/lib/contact";
import { generalWhatsAppUrl } from "@/lib/quote";

export function Footer() {
  return (
    <footer className="border-t border-cream/10 px-5 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <Seal className="size-16" />
            <Wordmark motto />
          </div>
          <p className="mt-4 max-w-md font-serif text-lg text-cream italic">{slogans.motto}</p>
          <p className="mt-4 text-cream-dim">Parceiro: {PARTNER_NAME}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a
              className="text-ember underline-offset-4 hover:underline"
              href={generalWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <a
              className="inline-flex items-center gap-2 text-ember underline-offset-4 hover:underline"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="size-4" />
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
        <div id="privacidade">
          <h2 className="font-condensed text-sm font-semibold tracking-[0.2em] text-flame uppercase">
            {privacy.title}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-cream-dim">
            {privacy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 w-full max-w-6xl text-sm text-cream-dim">
        Rudnei Sciole Churrasqueiro · Marília-SP
      </p>
    </footer>
  );
}
