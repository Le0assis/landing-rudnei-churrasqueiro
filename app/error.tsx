"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-16">
      <h1 className="font-display text-6xl text-cream">Algo saiu do eixo</h1>
      <p className="mt-4 text-lg text-cream-dim">
        Não consegui abrir esta parte agora. Pode tentar de novo. Se continuar, me chama no WhatsApp.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 h-12 rounded-full bg-flame px-6 font-semibold text-ink"
      >
        Tentar de novo
      </button>
    </main>
  );
}
