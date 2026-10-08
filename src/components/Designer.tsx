"use client";

import { useCallback, useEffect, useState } from "react";
import { AccessoryId, ChairId, DeskId, DurationId, accessoryById, chairById, deskById, formatIDR } from "@/lib/catalog";
import { DEFAULT_SETUP, PRESETS, Setup, decodeSetup, encodeSetup, normalize, pricing, sameSetup } from "@/lib/setup";
import Checkout from "./Checkout";
import Picker from "./Picker";
import Scene, { PickerTab } from "./Scene";
import Summary from "./Summary";

const STORAGE_KEY = "monis-workspace-v1";

export default function Designer() {
  const [setup, setSetup] = useState<Setup>(DEFAULT_SETUP);
  const [duration, setDuration] = useState<DurationId>("month");
  const [tab, setTab] = useState<PickerTab>("desk");
  const [standing, setStanding] = useState(false);
  const [night, setNight] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fromUrl = decodeSetup(window.location.search);
    if (fromUrl) {
      setSetup(fromUrl);
    } else {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? decodeSetup(saved) : null;
        if (parsed) setSetup(parsed);
      } catch {}
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const encoded = encodeSetup(setup);
    try {
      localStorage.setItem(STORAGE_KEY, encoded);
    } catch {}
    window.history.replaceState(null, "", `?${encoded}`);
  }, [setup, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const update = useCallback((next: Setup, message?: string) => {
    const { setup: valid, notice } = normalize(next);
    setSetup(valid);
    if (notice || message) setToast(notice ?? message!);
  }, []);

  const chooseDesk = (id: DeskId) => {
    if (id === setup.desk) return;
    update({ ...setup, desk: id });
    if (!deskById(id).adjustable) setStanding(false);
  };

  const chooseChair = (id: ChairId) => update({ ...setup, chair: id });

  const setQty = (id: AccessoryId, quantity: number) => {
    const accessories = { ...setup.accessories, [id]: Math.max(0, quantity) };
    const added = quantity > (setup.accessories[id] ?? 0);
    update({ ...setup, accessories }, added ? `${accessoryById(id).name} added` : undefined);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: "My monis workspace", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast("Link copied. Send it to your co-founder.");
    } catch {
      setToast("Couldn't copy the link. You can copy it from the address bar.");
    }
  };

  const desk = deskById(setup.desk);
  const p = pricing(setup, duration);
  const accessoryTotal = Object.values(setup.accessories).reduce((s, q) => s + (q ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#faf6ef] pb-28 lg:pb-10">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-lg font-black text-white">m</span>
          <div>
            <p className="text-base font-bold leading-tight text-stone-900">monis.rent</p>
            <p className="text-xs text-stone-500">Workspace Studio · Bali</p>
          </div>
        </div>
        <button onClick={share} className="rounded-xl px-3 py-2 text-sm font-semibold text-stone-700 ring-1 ring-stone-300 hover:bg-white">
          Share setup
        </button>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">Design your Bali workspace</h1>
            <p className="mt-1 text-stone-600">Pick a desk and chair, pile on the extras, and we deliver it to your villa, set up and ready.</p>
          </div>

          <section aria-label="Workspace preview" className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
            <div className="relative aspect-[5/3]">
              <Scene setup={setup} standing={standing} night={night} onPick={setTab} />
              {accessoryTotal === 0 && (
                <button
                  onClick={() => setTab("accessories")}
                  className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full bg-stone-900/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-stone-900"
                >
                  Your desk looks lonely. Add a monitor or a plant →
                </button>
              )}
              <div className="absolute bottom-3 left-3 flex gap-2">
                {desk.adjustable && (
                  <ToggleChip active={standing} onClick={() => setStanding((s) => !s)}>
                    {standing ? "⬇ Sit" : "⬆ Stand"}
                  </ToggleChip>
                )}
                <ToggleChip active={night} onClick={() => setNight((n) => !n)}>
                  {night ? "☀ Day" : "☾ Night"}
                </ToggleChip>
              </div>
              <p className="absolute bottom-3 right-3 hidden rounded-full bg-white/80 px-3 py-1 text-[11px] text-stone-500 backdrop-blur sm:block">
                Tip: click the desk or chair to swap it
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 px-4 py-3">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-stone-400">Start from</span>
              {PRESETS.map((preset) => {
                const active = sameSetup(preset.setup, setup);
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      update(preset.setup, `${preset.name} loaded. Make it yours.`);
                      setStanding(preset.setup.desk === "lift");
                    }}
                    aria-pressed={active}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                      active ? "bg-stone-900 text-white ring-stone-900" : "bg-white text-stone-700 ring-stone-200 hover:ring-stone-400"
                    }`}
                    title={preset.description}
                  >
                    {preset.name}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  update(DEFAULT_SETUP);
                  setStanding(false);
                }}
                className="ml-auto text-xs font-semibold text-stone-400 hover:text-stone-700"
              >
                Reset
              </button>
            </div>
          </section>

          <Picker tab={tab} onTab={setTab} setup={setup} onDesk={chooseDesk} onChair={chooseChair} onQty={setQty} />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <Summary setup={setup} duration={duration} onDuration={setDuration} onRent={() => setCheckoutOpen(true)} />
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div>
            <p className="text-xs text-stone-500">
              {desk.name} · {chairById(setup.chair).name}
              {accessoryTotal > 0 && ` · +${accessoryTotal}`}
            </p>
            <p className="text-lg font-bold text-stone-900 tabular-nums">
              {formatIDR(p.monthly)}
              <span className="text-sm font-normal text-stone-400">/mo</span>
            </p>
          </div>
          <button onClick={() => setCheckoutOpen(true)} className="rounded-2xl bg-teal-600 px-5 py-3 font-bold text-white hover:bg-teal-700">
            Rent setup →
          </button>
        </div>
      </div>

      <Checkout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        setup={setup}
        duration={duration}
        onDuration={setDuration}
        standing={standing}
        night={night}
      />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-8">
        {toast && <p className="toast-in rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-lg">{toast}</p>}
      </div>
    </div>
  );
}

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 backdrop-blur transition ${
        active ? "bg-stone-900 text-white ring-stone-900" : "bg-white/90 text-stone-700 ring-stone-200 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}
