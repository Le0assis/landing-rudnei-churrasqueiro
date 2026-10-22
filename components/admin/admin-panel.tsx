"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compressImage } from "@/lib/compress-image";
import type { AdminPhoto } from "@/lib/admin-photos";

type Payload = {
  photos: AdminPhoto[];
  shuffle: boolean;
  storage: string;
  storageMessage: string | null;
};

const storageLabel: Record<string, string> = {
  local: "Salvando neste computador, na pasta data/photos.",
  blob: "Salvando no Vercel Blob. O site lê essa lista sem um novo deploy.",
  unconfigured: "O armazenamento da Vercel ainda não está configurado.",
};

export function AdminPanel() {
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [alt, setAlt] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

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
      setStatus("Foto publicada no carrossel.");
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
    if (!data) return;
    const next = [...data.photos];
    const target = index + direction;
    const current = next[index];
    const other = next[target];
    if (!current || !other) return;
    next[index] = other;
    next[target] = current;
    await mutate(
      "/api/admin/photos/reorder",
      { method: "POST", body: JSON.stringify({ ids: next.map((photo) => photo.id) }) },
      "Ordem atualizada.",
    );
  }

  const photos = data?.photos ?? [];

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-condensed text-sm font-semibold tracking-[0.22em] text-ember uppercase">
            Área reservada
          </p>
          <h1 className="mt-2 font-display text-6xl text-cream">Fotos do carrossel</h1>
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

      <form onSubmit={upload} className="mt-8 grid gap-4 rounded-[1.5rem] border border-cream/10 bg-ink-2 p-5">
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
            placeholder="Picanha na brasa, aniversário em Marília"
            className="h-12 rounded-xl bg-ink px-3"
          />
        </div>
        <Button type="submit" size="touch" disabled={pending || data?.storage === "unconfigured"}>
          {pending ? "Enviando…" : "Publicar foto"}
        </Button>
      </form>

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
            abertura e depois as fotos continuam girando.
          </span>
        </span>
      </label>

      {data && photos.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-ember/50 p-5 text-cream-dim">
          Nenhuma foto ainda. O site mostra imagens ilustrativas até a primeira publicação.
        </p>
      ) : null}

      <ul className="mt-6 grid gap-4">
        {photos.map((photo, index) => (
          <li key={photo.id} className="grid gap-4 rounded-[1.4rem] border border-cream/10 bg-ink-2 p-4 sm:grid-cols-[140px_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" className="h-28 w-full rounded-xl object-cover sm:h-full" />
            <div>
              <p className="text-cream">{photo.alt}</p>
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
    </main>
  );
}
