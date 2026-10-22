import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { AdminPanel } from "@/components/admin/admin-panel";
import { LoginForm } from "@/components/admin/login-form";
import { readSessionFromCookie, SESSION_COOKIE } from "@/lib/auth";

export const metadata: Metadata = {
  title: { absolute: "Área reservada" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminRoute() {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-cream">Carregando a área reservada…</p>}>
      <AdminGate />
    </Suspense>
  );
}

async function AdminGate() {
  const jar = await cookies();
  const authenticated = readSessionFromCookie(jar.get(SESSION_COOKIE)?.value);
  return authenticated ? <AdminPanel /> : <LoginForm />;
}
