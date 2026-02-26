"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Building2, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

function parseApiError(text: string) {
  if (!text) return "No se pudo completar el registro.";
  try {
    const json = JSON.parse(text) as { error?: string };
    if (typeof json.error === "string") return json.error;
  } catch {
    // ignore
  }
  return "No se pudo completar el registro.";
}

export default function RegistroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OWNER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/mi-garage");
    }
  }, [status, router]);

  useEffect(() => {
    const incomingRole = searchParams.get("role");
    if (incomingRole === "OWNER" || incomingRole === "DEALER" || incomingRole === "WORKSHOP") {
      setRole(incomingRole);
    }
  }, [searchParams]);

  async function handleRegister() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        contactEmail: contactEmail || email,
        phone,
        whatsapp,
        password,
        role
      })
    });

    if (!response.ok) {
      const msg = await response.text();
      setError(parseApiError(msg));
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/mi-garage",
      redirect: false
    });

    if (!result || result.error) {
      setError("Cuenta creada, pero no se pudo iniciar sesión automáticamente.");
      setLoading(false);
      return;
    }

    router.push("/mi-garage");
    router.refresh();
  }

  return (
    <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
      <Card className="glass-panel rounded-[2rem] p-6">
        <span className="glass-chip inline-flex text-xs font-semibold uppercase tracking-[0.16em]">Registro</span>
        <h1 className="mt-4 text-3xl font-black text-white">Creá tu cuenta</h1>
        <p className="mt-2 text-sm text-slate-300">Con cuenta activa podés operar como particular, automotora o taller dentro del circuito verificable.</p>

        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-200">Nombre</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-200">Correo</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="vos@correo.com" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-200">Correo de contacto</label>
            <Input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              type="email"
              placeholder="ventas@tuempresa.com (opcional)"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-200">Teléfono</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+598 99 123 456" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-200">WhatsApp</label>
              <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+598 99 123 456" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-200">Contraseña</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mínimo 8 caracteres" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-200">Tipo de cuenta</label>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="OWNER">Particular</option>
              <option value="DEALER">Automotora</option>
              <option value="WORKSHOP">Taller</option>
            </Select>
            <div className="grid gap-2 pt-1 text-xs text-slate-300 sm:grid-cols-3">
              <p className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-2">
                <UserRound className="h-3.5 w-3.5 text-cyan-100" />
                Particular: historial de tus autos.
              </p>
              <p className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/30 bg-indigo-300/10 px-2.5 py-2">
                <Building2 className="h-3.5 w-3.5 text-indigo-100" />
                Automotora: stock + eventos por unidad.
              </p>
              <p className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-2.5 py-2">
                <Wrench className="h-3.5 w-3.5 text-emerald-100" />
                Taller: eventos con autorización.
              </p>
            </div>
          </div>

          {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/10 p-2 text-sm text-rose-200">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleRegister} disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>
        </div>
      </Card>

      <Card className="glass-panel relative overflow-hidden rounded-[2rem] p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_88%_84%,rgba(16,185,129,0.14),transparent_40%)]" />
        <div className="relative">
          <h2 className="text-xl font-black text-white">Tu perfil define tu operación</h2>
          <p className="mt-2 text-sm text-slate-300">Elegí el rol según cómo participás en la historia comercial del vehículo.</p>

          <div className="mt-4 grid gap-3">
            <article className="rounded-2xl border border-cyan-300/30 bg-gradient-to-r from-cyan-400/12 to-transparent p-4">
              <div className="inline-flex rounded-xl border border-cyan-300/45 bg-cyan-300/12 p-2 text-cyan-100">
                <UserRound className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-bold text-white">Particular</h3>
              <p className="mt-1 text-sm text-slate-300">Registrás servicios y reparaciones para vender con más respaldo.</p>
            </article>

            <article className="rounded-2xl border border-indigo-300/30 bg-gradient-to-r from-indigo-400/12 to-transparent p-4">
              <div className="inline-flex rounded-xl border border-indigo-300/45 bg-indigo-300/12 p-2 text-indigo-100">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-bold text-white">Automotora</h3>
              <p className="mt-1 text-sm text-slate-300">Gestionás múltiples unidades con señal comercial consistente.</p>
            </article>

            <article className="rounded-2xl border border-emerald-300/30 bg-gradient-to-r from-emerald-400/12 to-transparent p-4">
              <div className="inline-flex rounded-xl border border-emerald-300/45 bg-emerald-300/12 p-2 text-emerald-100">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-bold text-white">Taller</h3>
              <p className="mt-1 text-sm text-slate-300">Cargás trabajos reales con autorización, sin acceder a identidad del dueño.</p>
            </article>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-300/35 bg-amber-300/12 px-3 py-2.5 text-sm text-amber-100">
            <p className="inline-flex items-center gap-2 font-semibold text-amber-100">
              <ShieldCheck className="h-4 w-4" />
              Flujo privado y seguro
            </p>
            <p className="mt-1 text-amber-50/90">Sin cuenta no se permite cargar eventos ni operar en flujos privados.</p>
          </div>

          <div className="mt-5 flex gap-2">
            <Button asChild variant="outline">
              <Link href="/login">Ir a ingreso</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
