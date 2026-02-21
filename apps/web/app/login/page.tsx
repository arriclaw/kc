"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { KeyRound, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_EMAIL_AUTH === "true";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/mi-garage");
    }
  }, [status, router]);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/mi-garage",
      redirect: false
    });

    if (!result || result.error) {
      setError("No pudimos ingresar. Revisá correo y contraseña.");
      setLoading(false);
      return;
    }

    router.push("/mi-garage");
    router.refresh();
  }

  return (
    <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
      <Card className="glass-panel rounded-[2rem] p-6">
        <span className="glass-chip inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
          <KeyRound className="h-3.5 w-3.5" />
          Ingreso seguro
        </span>
        <h1 className="mt-4 text-3xl font-black text-white">Entrá a tu panel privado</h1>
        <p className="mt-2 text-sm text-slate-300">
          Desde acá gestionás tus autos y sus mantenimientos. Sin sesión iniciada, no podés modificar información.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-200">Correo</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="vos@correo.com" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-200">Contraseña</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Tu contraseña"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleLogin();
                }
              }}
            />
          </div>

          {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/10 p-2 text-sm text-rose-200">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleLogin} disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/registro">Crear cuenta</Link>
            </Button>
            {emailAuthEnabled ? (
              <Button
                onClick={() => signIn("email", { email, callbackUrl: "/mi-garage" })}
                variant="outline"
                disabled={!email}
              >
                Enviar link
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="glass-panel rounded-[2rem] p-6">
        <h2 className="text-xl font-bold text-white">¿Cómo es el flujo?</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate-300">
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">
            1. Te registrás como <span className="font-semibold">particular</span> o <span className="font-semibold">automotora</span>.
          </li>
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">
            2. Ingresás con correo y contraseña.
          </li>
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">
            3. Cargás vehículos y después eventos de mantenimiento por cada auto.
          </li>
        </ol>
        <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100">
          <UserRound className="h-3.5 w-3.5" />
          Sin sesión iniciada no podés registrar vehículos ni eventos.
        </p>

        <div className="mt-5 flex gap-2">
          <Button asChild variant="outline">
            <Link href="/registro">Ir a registro</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/acceso">Vista resumida</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
