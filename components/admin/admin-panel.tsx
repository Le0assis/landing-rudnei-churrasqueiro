"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminPhoto } from "@/lib/admin-photos";
import { compressImage } from "@/lib/compress-image";
import { SECTION_CATALOG, type SectionId, type SectionSettings } from "@/lib/sections";
import type { PhotoCategory } from "@/lib/storage/types";
import type { Testimonial } from "@/lib/testimonials";
import { TestimonialsPanel } from "@/components/admin/testimonials-panel";

type Panel = PhotoCategory | "depoimentos" | "secoes";

type Payload = {
  photos: AdminPhoto[];
  shuffle: boolean;
  sections?: SectionSettings;
  testimonials?: Testimonial[];
  storage: string;
  storageMessage: string | null;
};

const storageLabel: Record<string, string> = {
  local: "Salvando neste computador, na pasta data/photos.",
  blob: "Salvando no Vercel Blob. O site lê essa lista sem um novo deploy.",
  unconfigured: "O armazenamento da Vercel ainda não está configurado.",
};

const panels: { id: Panel; label: string }[] = [
  { id: "carrossel", label: "Carrossel" },
  { id: "festas", label: "Festas" },
  { id: "clientes", label: "Clientes" },
  { id: "choripan", label: "Choripán" },
  { id: "depoimentos", label: "Depoimentos" },
  { id: "secoes", label: "Seções" },
];

const categoryHint: Record<PhotoCategory, string> = {
  carrossel: "Estas fotos giram na seção “Fotos dos eventos” e também abrem a página.",
  festas: "Fotos da equipe e dos clientes, feitas em cada festa. Aparecem na aba Festas.",
  clientes: "Fotos com os clientes nos eventos. Aparecem na aba Clientes da galeria.",
  choripan: "Fotos do choripán. A primeira aparece no bloco de destaque do Choripán.",
};

export function AdminPanel() {
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [alt, setAlt] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>("carrossel");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/photos", { cache: "no-store" });
    if (response.status === 401) {
      router.refresh();
      return;
    }
    const body = (await response.json()) as Payload & { message?: string; ok?: boolean };
    if (!response.ok) {
      setError(body.message ?? "Não consegui carregar as fotos.");
      return;
    }
    setData(body);
    setError("");
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load().catch(() => setError("Não consegui carregar as fotos."));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (panel === "secoes" || panel === "depoimentos") return;
    const form = event.currentTarget;
    const input = form.elements.namedItem("foto");
    const file = input instanceof HTMLInputElement ? input.files?.[0] : undefined;
    if (!file) {
      setError("Escolha uma foto.");
      return;
    }

    setPending(true);
    setError("");
    setStatus("Preparando a foto…");
    try {
      const compressed = await compressImage(file);
      const body = new FormData();
      body.set("file", compressed.blob, "foto.jpg");
      body.set("alt", alt);
      body.set("category", panel);
      body.set("width", String(compressed.width));
      body.set("height", String(compressed.height));
      const response = await fetch("/api/admin/photos", { method: "POST", body });
      const payload = (await response.json()) as Payload & { message?: string };
      if (!response.ok) {
        setError(payload.message ?? "Não consegui enviar a foto.");
        return;
      }
      setData(payload);
      setAlt("");
      form.reset();
      setStatus("Foto publicada.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Não consegui enviar a foto.");
    } finally {
      setPending(false);
    }
  }

  async function mutate(url: string, init: RequestInit, success: string) {
    setPending(true);
    setError("");
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init.headers ?? {}),
        },
      });
      const payload = (await response.json()) as Payload & { message?: string };
      if (response.status === 401) {
        router.refresh();
        return;
      }
      if (!response.ok) {
        setError(payload.message ?? "Não consegui salvar.");
        return;
      }
      setData(payload);
      setStatus(success);
      setConfirmId(null);
    } catch {
      setError("Não consegui salvar.");
    } finally {
      setPending(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    if (!data || panel === "secoes" || panel === "depoimentos") return;
    const next = [...photos];
    const target = index + direction;
    const current = next[index];
    const other = next[target];
    if (!current || !other) return;
    next[index] = other;
    next[target] = current;
    await mutate(
      "/api/admin/photos/reorder",
      {
        method: "POST",
        body: JSON.stringify({ ids: next.map((photo) => photo.id), category: panel }),
      },
      "Ordem atualizada.",
    );
  }

  function toggle(id: SectionId, enabled: boolean) {
    void mutate(
      "/api/admin/sections",
      { method: "POST", body: JSON.stringify({ id, enabled }) },
      enabled ? "Seção visível na página." : "Seção escondida na página.",
    );
  }

  const photos = (data?.photos ?? []).filter((photo) => (photo.category ?? "carrossel") === panel);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-condensed text-sm font-semibold tracking-[0.22em] text-ember uppercase">
            Área reservada
          </p>
          <h1 className="mt-2 font-display text-6xl text-cream">Fotos, depoimentos e seções</h1>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-full px-5"
          onClick={() => {
            void fetch("/api/admin/logout", { method: "POST" }).then(() => router.refresh());
          }}
        >
          Sair
        </Button>
      </div>

      <p className="mt-4 text-cream-dim">
        {data ? (storageLabel[data.storage] ?? "Armazenamento ativo.") : "Carregando…"}
      </p>
      {data?.storageMessage ? <p className="mt-2 text-ember">{data.storageMessage}</p> : null}
      {status ? <p className="mt-3 text-cream">{status}</p> : null}
      {error ? (
        <p role="alert" className="mt-3 text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Painel">
        {panels.map((item) => {
          const selected = panel === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`h-12 rounded-full px-5 font-condensed text-sm font-semibold tracking-[0.14em] uppercase ${
                selected ? "bg-flame text-ink" : "border border-cream/20 text-cream"
              }`}
              onClick={() => {
                setPanel(item.id);
                setConfirmId(null);
                setStatus("");
                setError("");
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {panel === "depoimentos" ? (
        <TestimonialsPanel
          items={data?.testimonials ?? []}
          disabled={!data || pending || data.storage === "unconfigured"}
          mutate={mutate}
        />
      ) : panel === "secoes" ? (
        <fieldset className="mt-8 grid gap-3" disabled={!data || pending || data.storage === "unconfigured"}>
          <legend className="font-condensed text-sm font-semibold tracking-[0.16em] text-ember uppercase">
            O que aparece na página
          </legend>
          <p className="text-sm text-cream-dim">
            Desligar uma seção tira ela da página pública e do menu. A aba da galeria só aparece se a galeria
            também estiver ligada.
          </p>
          {SECTION_CATALOG.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 rounded-2xl border border-cream/10 bg-ink-2 p-4 text-cream ${
                item.nested ? "ml-4" : ""
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 size-5 accent-flame"
                checked={data?.sections?.[item.id] ?? true}
                onChange={(event) => toggle(item.id, event.target.checked)}
              />
              <span>
                {item.label}
                <span className="mt-1 block text-sm text-cream-dim">{item.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>
      ) : (
        <>
          <p className="mt-6 text-cream-dim">{categoryHint[panel]}</p>
          <form onSubmit={upload} className="mt-4 grid gap-4 rounded-[1.5rem] border border-cream/10 bg-ink-2 p-5">
            <div className="grid gap-2">
              <Label htmlFor="foto">Nova foto</Label>
              <Input
                id="foto"
                name="foto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="h-12 rounded-xl bg-ink pt-2"
              />
              <p className="text-sm text-cream-dim">
                JPG, PNG ou WEBP. O navegador reduz para no máximo 1600 px antes de enviar.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alt">Descrição da foto</Label>
              <Input
                id="alt"
                value={alt}
                onChange={(event) => setAlt(event.target.value)}
                placeholder="Opcional. Vira a legenda e o texto alternativo."
                className="h-12 rounded-xl bg-ink px-3"
              />
            </div>
            <Button type="submit" size="touch" disabled={pending || data?.storage === "unconfigured"}>
              {pending ? "Enviando…" : "Publicar foto"}
            </Button>
          </form>

          {panel === "carrossel" ? (
            <label className="mt-6 flex items-start gap-3 text-cream">
              <input
                type="checkbox"
                className="mt-1 size-5 accent-flame"
                checked={data?.shuffle ?? true}
                disabled={!data || pending}
                onChange={(event) => {
                  void mutate(
                    "/api/admin/settings",
                    { method: "POST", body: JSON.stringify({ shuffle: event.target.checked }) },
                    event.target.checked
                      ? "O carrossel vai embaralhar a cada visita."
                      : "O carrossel vai seguir a ordem desta lista.",
                  );
                }}
              />
              <span>
                Embaralhar a ordem a cada visita
                <span className="mt-1 block text-sm text-cream-dim">
                  Desligado, o site usa a ordem dos botões subir e descer. Ligado, a ordem muda a cada
                  abertura e depois as fotos continuam girando. Vale só para o carrossel.
                </span>
              </span>
            </label>
          ) : null}

          {data && photos.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-ember/50 p-5 text-cream-dim">
              {panel === "carrossel"
                ? "Nenhuma foto ainda. O site mostra imagens ilustrativas até a primeira publicação."
                : "Nenhuma foto ainda. A aba fica vazia na página até a primeira publicação."}
            </p>
          ) : null}

          <ul className="mt-6 grid gap-4">
            {photos.map((photo, index) => (
              <li key={photo.id} className="grid gap-4 rounded-[1.4rem] border border-cream/10 bg-ink-2 p-4 sm:grid-cols-[140px_1fr]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="h-28 w-full rounded-xl object-cover sm:h-full" />
                <div>
                  <p className="text-cream">{photo.caption || photo.alt}</p>
                  <p className="mt-1 text-sm text-cream-dim">
                    {photo.width}×{photo.height} · {Math.max(1, Math.round(photo.bytes / 1024))} KB
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" variant="outline" className="h-11 rounded-full" disabled={pending || index === 0} onClick={() => void move(index, -1)}>
                      Subir
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-full"
                      disabled={pending || index === photos.length - 1}
                      onClick={() => void move(index, 1)}
                    >
                      Descer
                    </Button>
                    {confirmId === photo.id ? (
                      <>
                        <Button
                          type="button"
                          variant="destructive"
                          className="h-11 rounded-full"
                          disabled={pending}
                          onClick={() =>
                            void mutate(`/api/admin/photos/${photo.id}`, { method: "DELETE", headers: {} }, "Foto apagada.")
                          }
                        >
                          Confirmar
                        </Button>
                        <Button type="button" variant="ghost" className="h-11 rounded-full" onClick={() => setConfirmId(null)}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button type="button" variant="destructive" className="h-11 rounded-full" onClick={() => setConfirmId(photo.id)}>
                        Apagar
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
