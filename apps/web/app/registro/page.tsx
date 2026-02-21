"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Building2, UserRound } from "lucide-react";
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
        <p className="mt-2 text-sm text-slate-300">Con cuenta activa podés registrar autos y subir mantenimientos en privado.</p>

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
            </Select>
            <div className="grid gap-2 pt-1 text-xs text-slate-300 sm:grid-cols-2">
              <p className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-2">
                <UserRound className="h-3.5 w-3.5 text-cyan-100" />
                Particular: historial de tus autos.
              </p>
              <p className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/30 bg-indigo-300/10 px-2.5 py-2">
                <Building2 className="h-3.5 w-3.5 text-indigo-100" />
                Automotora: stock + eventos por unidad.
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

      <Card className="glass-panel rounded-[2rem] p-6">
        <h2 className="text-xl font-bold text-white">Antes de seguir</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">
            Particular: ideal para guardar cada mantenimiento de tu auto.
          </li>
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">
            Automotora: ideal para manejar múltiples autos y su historial por unidad.
          </li>
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">
            Sin cuenta no se permite cargar ni editar información.
          </li>
        </ul>

        <div className="mt-5 flex gap-2">
          <Button asChild variant="outline">
            <Link href="/login">Ir a ingreso</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/acceso">Vista resumida</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
