"use client";

import { useId } from "react";
import { DURATIONS, DurationId, FREE_DELIVERY_FROM, formatIDR } from "@/lib/catalog";
import { Setup, lineItems, pricing } from "@/lib/setup";

export function DurationPicker({ value, onChange }: { value: DurationId; onChange: (d: DurationId) => void }) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Rental period</legend>
      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-stone-100 p-1">
        {DURATIONS.map((d) => (
          <label
            key={d.id}
            className={`relative cursor-pointer rounded-xl px-1 py-2 text-center text-xs font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-500 ${
              value === d.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <input type="radio" name={name} value={d.id} checked={value === d.id} onChange={() => onChange(d.id)} className="sr-only" />
            {d.label}
            {d.discount > 0 && <span className="block text-[10px] font-medium text-teal-600">−{d.discount * 100}%</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function PriceBreakdown({ setup, duration }: { setup: Setup; duration: DurationId }) {
  const p = pricing(setup, duration);
  const toFree = FREE_DELIVERY_FROM - p.monthly;
  return (
    <dl className="space-y-1.5 text-sm">
      <Row label="Monthly rate" value={`${formatIDR(p.monthly)}/mo`} />
      <Row label={`Rental · ${p.duration.label}`} value={formatIDR(p.rental + p.savings)} />
      {p.savings > 0 && <Row label="Long-stay discount" value={`−${formatIDR(p.savings)}`} accent />}
      <Row label="Delivery & setup" value={p.delivery === 0 ? "Free" : formatIDR(p.delivery)} accent={p.delivery === 0} />
      {p.delivery > 0 && (
        <p className="text-[11px] text-stone-400">Add {formatIDR(toFree)}/mo more for free delivery & setup.</p>
      )}
      <div className="flex items-baseline justify-between border-t border-stone-200 pt-2">
        <dt className="font-semibold text-stone-900">Total</dt>
        <dd className="text-xl font-bold text-stone-900 tabular-nums" aria-live="polite">
          {formatIDR(p.total)}
        </dd>
      </div>
    </dl>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-stone-500">{label}</dt>
      <dd className={`tabular-nums ${accent ? "font-medium text-teal-700" : "text-stone-800"}`}>{value}</dd>
    </div>
  );
}

export function ItemList({ setup, compact }: { setup: Setup; compact?: boolean }) {
  return (
    <ul className={`divide-y divide-stone-100 ${compact ? "text-sm" : ""}`}>
      {lineItems(setup).map((item) => (
        <li key={item.key} className="flex items-center justify-between gap-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-stone-800">
              {item.quantity > 1 && <span className="text-teal-700">{item.quantity} × </span>}
              {item.name}
            </p>
            <p className="text-[11px] text-stone-400">{item.detail}</p>
          </div>
          <p className="shrink-0 text-sm tabular-nums text-stone-600">{formatIDR(item.monthly)}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Summary({
  setup,
  duration,
  onDuration,
  onRent,
}: {
  setup: Setup;
  duration: DurationId;
  onDuration: (d: DurationId) => void;
  onRent: () => void;
}) {
  return (
    <aside aria-label="Your setup" className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-stone-900">Your setup</h2>
        <span className="text-xs text-stone-400">{lineItems(setup).length} items</span>
      </div>
      <div className="max-h-[38vh] overflow-y-auto pr-1">
        <ItemList setup={setup} />
      </div>
      <div className="mt-4 space-y-4">
        <DurationPicker value={duration} onChange={onDuration} />
        <PriceBreakdown setup={setup} duration={duration} />
        <button
          onClick={onRent}
          className="w-full rounded-2xl bg-teal-600 px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 active:scale-[0.99]"
        >
          Rent this setup →
        </button>
        <p className="text-center text-[11px] text-stone-400">Delivered and assembled in your villa. Swap or return anytime.</p>
      </div>
    </aside>
  );
}
