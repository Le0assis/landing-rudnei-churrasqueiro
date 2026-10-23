"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TESTIMONIAL_LIMITS, type Testimonial } from "@/lib/testimonials";

type Mutate = (url: string, init: RequestInit, success: string) => Promise<void>;

const empty = { name: "", text: "", event: "" };

export function TestimonialsPanel({
  items,
  disabled,
  mutate,
}: {
  items: Testimonial[];
  disabled: boolean;
  mutate: Mutate;
}) {
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const url = "/api/admin/testimonials";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId) {
      await mutate(url, { method: "PATCH", body: JSON.stringify({ id: editingId, ...form }) }, "Depoimento atualizado.");
    } else {
      await mutate(url, { method: "POST", body: JSON.stringify(form) }, "Depoimento adicionado.");
    }
    setForm(empty);
    setEditingId(null);
  }

  return (
    <>
      <p className="mt-6 text-cream-dim">
        Comentários em texto que aparecem na seção Depoimentos. Só publique com a autorização do cliente.
        Depoimento desligado continua salvo aqui, mas some da página.
      </p>
      <form onSubmit={submit} className="mt-4 grid gap-4 rounded-[1.5rem] border border-cream/10 bg-ink-2 p-5">
        <p className="font-condensed text-sm font-semibold tracking-[0.16em] text-ember uppercase">
          {editingId ? "Editar depoimento" : "Novo depoimento"}
        </p>
        <div className="grid gap-2">
          <Label htmlFor="dep-nome">Nome do cliente</Label>
          <Input
            id="dep-nome"
            required
            maxLength={TESTIMONIAL_LIMITS.name}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="h-12 rounded-xl bg-ink px-3"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dep-texto">Texto</Label>
          <textarea
            id="dep-texto"
            required
            rows={4}
            maxLength={TESTIMONIAL_LIMITS.text}
            value={form.text}
            onChange={(event) => setForm({ ...form, text: event.target.value })}
            className="rounded-xl border border-input bg-ink p-3 text-cream"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dep-evento">Evento ou data (opcional)</Label>
          <Input
            id="dep-evento"
            maxLength={TESTIMONIAL_LIMITS.event}
            value={form.event}
            placeholder="Ex.: Aniversário · Marília, março de 2025"
            onChange={(event) => setForm({ ...form, event: event.target.value })}
            className="h-12 rounded-xl bg-ink px-3"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="touch" disabled={disabled}>
            {editingId ? "Salvar alterações" : "Adicionar depoimento"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="ghost"
              className="h-12 rounded-full"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Cancelar edição
            </Button>
          ) : null}
        </div>
      </form>

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-ember/50 p-5 text-cream-dim">
          Nenhum depoimento. Sem depoimento ligado, a seção não aparece na página.
        </p>
      ) : null}

      <ul className="mt-6 grid gap-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-[1.4rem] border border-cream/10 bg-ink-2 p-4">
            <p className="whitespace-pre-line text-cream">“{item.text}”</p>
            <p className="mt-2 text-sm text-cream-dim">
              {item.name}
              {item.event ? ` · ${item.event}` : ""}
              {item.illustrative ? " · ilustrativo" : ""}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className="mr-2 flex items-center gap-2 text-sm text-cream">
                <input
                  type="checkbox"
                  className="size-5 accent-flame"
                  checked={item.enabled}
                  disabled={disabled}
                  onChange={(event) =>
                    void mutate(
                      url,
                      { method: "PATCH", body: JSON.stringify({ id: item.id, enabled: event.target.checked }) },
                      event.target.checked ? "Depoimento visível na página." : "Depoimento escondido da página.",
                    )
                  }
                />
                Visível na página
              </label>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full"
                disabled={disabled}
                onClick={() => {
                  setEditingId(item.id);
                  setForm({ name: item.name, text: item.text, event: item.event });
                }}
              >
                Editar
              </Button>
              {confirmId === item.id ? (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-11 rounded-full"
                    disabled={disabled}
                    onClick={() => {
                      setConfirmId(null);
                      if (editingId === item.id) {
                        setEditingId(null);
                        setForm(empty);
                      }
                      void mutate(url, { method: "DELETE", body: JSON.stringify({ id: item.id }) }, "Depoimento apagado.");
                    }}
                  >
                    Confirmar
                  </Button>
                  <Button type="button" variant="ghost" className="h-11 rounded-full" onClick={() => setConfirmId(null)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button type="button" variant="destructive" className="h-11 rounded-full" onClick={() => setConfirmId(item.id)}>
                  Apagar
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
