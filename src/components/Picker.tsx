"use client";

import { ACCESSORIES, AccessoryId, CHAIRS, ChairId, DESKS, DeskId, deskById, formatIDR } from "@/lib/catalog";
import { Setup, qty } from "@/lib/setup";
import { AccessoryThumb, ChairThumb, DeskThumb } from "./art";
import type { PickerTab } from "./Scene";

const TABS: { id: PickerTab; label: string }[] = [
  { id: "desk", label: "Desk" },
  { id: "chair", label: "Chair" },
  { id: "accessories", label: "Accessories" },
];

type Props = {
  tab: PickerTab;
  onTab: (tab: PickerTab) => void;
  setup: Setup;
  onDesk: (id: DeskId) => void;
  onChair: (id: ChairId) => void;
  onQty: (id: AccessoryId, quantity: number) => void;
};

export default function Picker({ tab, onTab, setup, onDesk, onChair, onQty }: Props) {
  const accessoryCount = Object.values(setup.accessories).reduce((sum, q) => sum + (q ?? 0), 0);

  return (
    <section aria-label="Choose items" className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-200 sm:p-5">
      <div role="tablist" aria-label="Item category" className="mb-4 flex gap-1 rounded-2xl bg-stone-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => onTab(t.id)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              tab === t.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {t.label}
            {t.id === "accessories" && accessoryCount > 0 && (
              <span className="ml-1.5 rounded-full bg-teal-600 px-1.5 py-0.5 text-[11px] text-white">{accessoryCount}</span>
            )}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "desk" && (
          <div className="grid gap-3 sm:grid-cols-3">
            {DESKS.map((d) => (
              <OptionCard
                key={d.id}
                selected={setup.desk === d.id}
                onClick={() => onDesk(d.id)}
                thumb={<DeskThumb desk={d} />}
                title={d.name}
                subtitle={d.tagline}
                meta={d.adjustable ? `${d.specs} · try Stand mode` : d.specs}
                price={d.monthly}
              />
            ))}
          </div>
        )}

        {tab === "chair" && (
          <div className="grid gap-3 sm:grid-cols-3">
            {CHAIRS.map((c) => (
              <OptionCard
                key={c.id}
                selected={setup.chair === c.id}
                onClick={() => onChair(c.id)}
                thumb={<ChairThumb id={c.id} />}
                title={c.name}
                subtitle={c.tagline}
                meta={c.specs}
                price={c.monthly}
              />
            ))}
          </div>
        )}

        {tab === "accessories" && (
          <div className="space-y-5">
            {(["On the desk", "Around the room"] as const).map((group) => (
              <div key={group}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">{group}</h3>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {ACCESSORIES.filter((a) => a.group === group).map((a) => {
                    const current = qty(setup, a.id);
                    const max = a.id === "monitor" ? deskById(setup.desk).maxMonitors : a.maxQty;
                    return (
                      <div
                        key={a.id}
                        className={`flex items-center gap-3 rounded-2xl p-3 ring-1 transition ${
                          current > 0 ? "bg-teal-50 ring-teal-500" : "bg-white ring-stone-200 hover:ring-stone-300"
                        }`}
                      >
                        <div className="h-14 w-16 shrink-0 rounded-xl bg-stone-50 p-1.5">
                          <AccessoryThumb id={a.id} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-stone-900">{a.name}</p>
                          <p className="truncate text-xs text-stone-500">{a.tagline}</p>
                          <p className="mt-0.5 text-xs font-medium text-stone-700">
                            {formatIDR(a.monthly)}
                            <span className="text-stone-400">/mo</span>
                          </p>
                        </div>
                        {a.maxQty > 1 ? (
                          <Stepper
                            label={a.name}
                            value={current}
                            max={max}
                            onChange={(n) => onQty(a.id, n)}
                            maxHint={max < a.maxQty ? `${deskById(setup.desk).name} fits ${max}` : undefined}
                          />
                        ) : (
                          <button
                            onClick={() => onQty(a.id, current > 0 ? 0 : 1)}
                            aria-pressed={current > 0}
                            aria-label={`${current > 0 ? "Remove" : "Add"} ${a.name}`}
                            className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
                              current > 0 ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-stone-900 text-white hover:bg-stone-700"
                            }`}
                          >
                            {current > 0 ? "Added ✓" : "+ Add"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function OptionCard({
  selected,
  onClick,
  thumb,
  title,
  subtitle,
  meta,
  price,
}: {
  selected: boolean;
  onClick: () => void;
  thumb: React.ReactNode;
  title: string;
  subtitle: string;
  meta: string;
  price: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex flex-col rounded-2xl p-3 text-left ring-1 transition ${
        selected ? "bg-teal-50 ring-2 ring-teal-500" : "bg-white ring-stone-200 hover:-translate-y-0.5 hover:ring-stone-300 hover:shadow-sm"
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 rounded-full bg-teal-600 px-2 py-0.5 text-[11px] font-semibold text-white">Selected</span>
      )}
      <div className="mb-2 flex h-24 items-end justify-center rounded-xl bg-stone-50 p-2">{thumb}</div>
      <p className="text-sm font-semibold text-stone-900">{title}</p>
      <p className="text-xs text-stone-500">{subtitle}</p>
      <p className="mt-1 text-[11px] text-stone-400">{meta}</p>
      <p className="mt-2 text-sm font-semibold text-stone-800">
        {formatIDR(price)}
        <span className="font-normal text-stone-400">/mo</span>
      </p>
    </button>
  );
}

function Stepper({
  label,
  value,
  max,
  onChange,
  maxHint,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (n: number) => void;
  maxHint?: string;
}) {
  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex items-center rounded-xl bg-stone-900 text-white">
        <button
          onClick={() => onChange(value - 1)}
          disabled={value === 0}
          aria-label={`Remove one ${label}`}
          className="h-8 w-8 rounded-l-xl text-lg leading-none hover:bg-stone-700 disabled:opacity-30"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`Add one ${label}`}
          className="h-8 w-8 rounded-r-xl text-lg leading-none hover:bg-stone-700 disabled:opacity-30"
        >
          +
        </button>
      </div>
      {maxHint && value >= max && <span className="text-[10px] text-stone-400">{maxHint}</span>}
    </div>
  );
}
