"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AREAS, DurationId, formatIDR } from "@/lib/catalog";
import { Setup, pricing } from "@/lib/setup";
import Scene from "./Scene";
import { DurationPicker, ItemList, PriceBreakdown } from "./Summary";

type Props = {
  open: boolean;
  onClose: () => void;
  setup: Setup;
  duration: DurationId;
  onDuration: (d: DurationId) => void;
  standing: boolean;
  night: boolean;
};

const isoDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export default function Checkout({ open, onClose, setup, duration, onDuration, standing, night }: Props) {
  const [step, setStep] = useState<"form" | "sending" | "done">("form");
  const [orderRef, setOrderRef] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstField = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep("form");
    setErrors({});
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstField.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get("name")).trim()) next.name = "Tell us who we're delivering to.";
    const contact = String(data.get("contact")).trim();
    if (!/^\+?[\d\s-]{8,}$/.test(contact) && !/^\S+@\S+\.\S+$/.test(contact)) next.contact = "Add a WhatsApp number or email.";
    if (!data.get("date")) next.date = "Pick a delivery date.";
    setErrors(next);
    if (Object.keys(next).length) {
      dialog.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setStep("sending");
    setTimeout(() => {
      setOrderRef(`MNS-${Math.random().toString(36).slice(2, 7).toUpperCase()}`);
      setStep("done");
    }, 900);
  };

  const p = pricing(setup, duration);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(e) => e.stopPropagation()}
        className="sheet-in max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-white/90 px-5 py-4 backdrop-blur">
          <h2 id="checkout-title" className="text-lg font-bold text-stone-900">
            {step === "done" ? "Your workspace is on its way" : "Rent your setup"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-stone-500 hover:bg-stone-100">
            ✕
          </button>
        </div>

        {step === "done" ? (
          <div className="px-5 py-8 text-center sm:px-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl">🌴</div>
            <p className="text-sm text-stone-500">Request reference</p>
            <p className="mb-4 font-mono text-xl font-bold text-stone-900">{orderRef}</p>
            <p className="mx-auto max-w-md text-stone-600">
              Thanks! The monis team will message you within 2 hours to confirm availability and your delivery slot. You pay only after
              confirmation.
            </p>
            <div className="mx-auto mt-6 aspect-[5/3] max-w-md overflow-hidden rounded-2xl ring-1 ring-stone-200">
              <Scene setup={setup} standing={standing} night={night} onPick={() => {}} />
            </div>
            <p className="mt-4 text-sm font-semibold text-stone-800">
              {formatIDR(p.total)} · {p.duration.label}
            </p>
            <button onClick={onClose} className="mt-6 rounded-2xl bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-700">
              Back to my workspace
            </button>
            <p className="mt-3 text-[11px] text-stone-400">Demo checkout: no real order or payment is created.</p>
          </div>
        ) : (
          <div className="grid gap-6 p-5 sm:grid-cols-2">
            <div>
              <div className="mb-3 aspect-[5/3] overflow-hidden rounded-2xl ring-1 ring-stone-200">
                <Scene setup={setup} standing={standing} night={night} onPick={() => {}} />
              </div>
              <ItemList setup={setup} compact />
            </div>

            <form onSubmit={submit} noValidate className="space-y-4">
              <DurationPicker value={duration} onChange={onDuration} />
              <Field label="Your name" name="name" error={errors.name}>
                <input ref={firstField} name="name" autoComplete="name" className={inputClass(errors.name)} placeholder="Alex Rivera" />
              </Field>
              <Field label="WhatsApp or email" name="contact" error={errors.contact}>
                <input name="contact" autoComplete="email" className={inputClass(errors.contact)} placeholder="+62 812 3456 7890" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Area" name="area">
                  <select name="area" className={inputClass()} defaultValue="Canggu">
                    {AREAS.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Delivery date" name="date" error={errors.date}>
                  <input type="date" name="date" min={isoDate(1)} defaultValue={isoDate(3)} className={inputClass(errors.date)} />
                </Field>
              </div>
              <Field label="Villa / address notes (optional)" name="notes">
                <textarea name="notes" rows={2} className={inputClass()} placeholder="Villa name, Google Maps link, gate code…" />
              </Field>

              <div className="rounded-2xl bg-stone-50 p-4">
                <PriceBreakdown setup={setup} duration={duration} />
              </div>

              <button
                type="submit"
                disabled={step === "sending"}
                className="w-full rounded-2xl bg-teal-600 px-4 py-3.5 font-bold text-white transition hover:bg-teal-700 disabled:opacity-70"
              >
                {step === "sending" ? "Sending request…" : `Request delivery · ${formatIDR(p.total)}`}
              </button>
              <p className="text-center text-[11px] text-stone-400">No payment now. We confirm availability first.</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const inputClass = (error?: string) =>
  `w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:ring-2 focus:ring-teal-500 ${
    error ? "border-rose-400" : "border-stone-200"
  }`;

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-stone-600">{label}</span>
      {children}
      {error && (
        <span id={`${name}-error`} role="alert" className="mt-1 block text-xs text-rose-600">
          {error}
        </span>
      )}
    </label>
  );
}
