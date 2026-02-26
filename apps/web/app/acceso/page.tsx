import Link from "next/link";
import { Building2, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccesoPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-[1.2fr_0.8fr]">
      <Card className="glass-panel rounded-[2rem] p-8">
        <span className="glass-chip inline-flex text-xs font-semibold uppercase tracking-[0.16em]">Acceso privado</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Primero tu cuenta, después tu operación</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Para cargar eventos, administrar unidades o trabajar como taller autorizado, primero necesitás iniciar sesión.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-5">
            <div className="inline-flex rounded-xl border border-cyan-300/45 bg-cyan-300/10 p-2 text-cyan-100">
              <UserRound className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-lg font-bold text-white">Cuenta Particular</h2>
            <p className="mt-1 text-sm text-slate-300">Guardá todo el historial de tu auto y compartilo cuando te convenga.</p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-5">
            <div className="inline-flex rounded-xl border border-indigo-300/45 bg-indigo-300/10 p-2 text-indigo-100">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-lg font-bold text-white">Cuenta Automotora</h2>
            <p className="mt-1 text-sm text-slate-300">Gestioná múltiples autos y trazabilidad por unidad de stock.</p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-5">
            <div className="inline-flex rounded-xl border border-emerald-300/45 bg-emerald-300/10 p-2 text-emerald-100">
              <Wrench className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-lg font-bold text-white">Cuenta Taller</h2>
            <p className="mt-1 text-sm text-slate-300">Registrá services y reparaciones en autos con autorización del titular.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/registro">Crear cuenta</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Ya tengo cuenta</Link>
          </Button>
        </div>
      </Card>

      <Card className="glass-panel rounded-[2rem] p-6">
        <h2 className="text-xl font-bold text-white">Cómo sigue</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate-300">
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">1. Elegís tipo de cuenta y te registrás.</li>
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">2. Ingresás al panel privado.</li>
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">3. Particular/automotora registran autos; taller solicita autorización.</li>
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/35 p-3">4. Cada evento queda inmutable, con procedencia y respaldo.</li>
        </ol>

        <div className="mt-5 space-y-2 text-xs text-slate-300">
          <p className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/35 bg-emerald-300/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-200" />
            Cada alta queda auditada y firmada.
          </p>
          <p className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-3 py-2">
            <Wrench className="h-4 w-4 text-cyan-100" />
            Eventos por vehículo, no sueltos.
          </p>
        </div>
      </Card>
    </div>
  );
}
