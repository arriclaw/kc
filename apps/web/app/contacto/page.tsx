"use client";

import { useState, type FormEvent } from "react";
import { Mail, MessageSquareText, Phone, Send, ShieldCheck } from "lucide-react";
import { contactMessageSchema } from "@hdv/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  name: string;
  email: string;
  phone: string;
  requesterType: "PARTICULAR" | "AUTOMOTORA" | "COMPRADOR" | "OTRO";
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  requesterType: "PARTICULAR",
  subject: "",
  message: ""
};

export default function ContactoPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const parsed = contactMessageSchema.safeParse({
      ...form,
      phone: form.phone || undefined
    });

    if (!parsed.success) {
      setError("Revisá los datos: hay campos incompletos o con formato inválido.");
      return;
    }

    setSending(true);
    const response = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };

    if (!response.ok) {
      if (typeof payload.error === "string") {
        setError(payload.error);
      } else {
        setError("No pudimos enviar el mensaje. Probá de nuevo.");
      }
      setSending(false);
      return;
    }

    setSuccess(payload.message || "Mensaje enviado.");
    setForm(initialState);
    setSending(false);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-[1.05fr_0.95fr]">
      <Card className="glass-panel rounded-[2rem] p-6 sm:p-7">
        <span className="glass-chip inline-flex text-xs font-semibold uppercase tracking-[0.16em]">Contacto KC</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Hablemos de tu caso</h1>
        <p className="mt-2 text-sm text-slate-300">
          Si querés ayuda para implementar, publicar o escalar tu operación en Kilómetro Claro, escribinos y te
          respondemos por mail.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-200">Nombre</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-200">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="vos@correo.com"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-200">Teléfono (opcional)</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+598 99 123 456"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-200">Perfil</label>
              <Select
                value={form.requesterType}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    requesterType: e.target.value as FormState["requesterType"]
                  }))
                }
              >
                <option value="PARTICULAR">Particular</option>
                <option value="AUTOMOTORA">Automotora</option>
                <option value="COMPRADOR">Comprador</option>
                <option value="OTRO">Otro</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-200">Asunto</label>
            <Input
              value={form.subject}
              onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="¿Sobre qué necesitás ayuda?"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-200">Mensaje</label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Contanos el contexto: objetivo, tipo de vehículo, volumen de operación o dudas puntuales."
            />
          </div>

          {error ? <p className="rounded-xl border border-rose-300/45 bg-rose-300/10 p-3 text-sm text-rose-200">{error}</p> : null}
          {success ? (
            <p className="rounded-xl border border-emerald-300/45 bg-emerald-300/10 p-3 text-sm text-emerald-100">{success}</p>
          ) : null}

          <Button type="submit" disabled={sending} className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            {sending ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </form>
      </Card>

      <Card className="glass-panel rounded-[2rem] p-6 sm:p-7">
        <h2 className="text-xl font-black text-white">Canales y tiempos de respuesta</h2>
        <p className="mt-2 text-sm text-slate-300">Soporte comercial y operativo para particulares y automotoras.</p>

        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/35 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <Mail className="h-4 w-4 text-cyan-200" />
              Mail
            </p>
            <p className="mt-1 text-sm text-slate-300">contacto@kilometroclaro.uy</p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/35 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <Phone className="h-4 w-4 text-cyan-200" />
              WhatsApp / Llamada
            </p>
            <p className="mt-1 text-sm text-slate-300">+598 99 123 456</p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/35 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <MessageSquareText className="h-4 w-4 text-cyan-200" />
              Alcance
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Alta de cuenta, operación de Mi Garage, gestión de historial, transferencias y soporte de publicación.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-300/35 bg-emerald-300/10 p-4 text-sm text-emerald-100">
            <p className="inline-flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Privacidad y trazabilidad
            </p>
            <p className="mt-1 text-emerald-100/90">Tu mensaje queda registrado para seguimiento interno y control de calidad.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
