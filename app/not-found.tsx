import Link from "next/link";
import { WhatsAppLink } from "@/components/landing/whatsapp-link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-16">
      <p className="font-condensed text-sm font-semibold tracking-[0.22em] text-ember uppercase">
        Marília-SP
      </p>
      <h1 className="mt-3 font-display text-6xl text-cream">Essa página não existe</h1>
      <p className="mt-4 text-lg text-cream-dim">
        O churrasco continua no começo do site. Se preferir, me chama direto no WhatsApp.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full border border-cream/20 px-6 font-semibold text-cream"
        >
          Voltar ao início
        </Link>
        <WhatsAppLink>Chamar no WhatsApp</WhatsAppLink>
      </div>
    </main>
  );
}
