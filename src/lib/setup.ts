import {
  ACCESSORIES,
  AccessoryId,
  ChairId,
  DELIVERY_FEE,
  DESKS,
  DeskId,
  DURATIONS,
  DurationId,
  FREE_DELIVERY_FROM,
  CHAIRS,
  accessoryById,
  chairById,
  deskById,
} from "./catalog";

export type Setup = {
  desk: DeskId;
  chair: ChairId;
  accessories: Partial<Record<AccessoryId, number>>;
};

export type Preset = { id: string; name: string; description: string; setup: Setup };

export const DEFAULT_SETUP: Setup = {
  desk: "teak",
  chair: "mesh",
  accessories: { monitor: 1, keyboard: 1, deskPlant: 1 },
};

export const PRESETS: Preset[] = [
  {
    id: "starter",
    name: "Nomad Starter",
    description: "Laptop-first, light and cheap",
    setup: { desk: "compact", chair: "rattan", accessories: { laptopStand: 1, keyboard: 1, deskPlant: 1, fan: 1 } },
  },
  {
    id: "dev",
    name: "Dev Battlestation",
    description: "Three screens, standing desk",
    setup: {
      desk: "lift",
      chair: "mesh",
      accessories: { monitor: 3, keyboard: 1, lamp: 1, headphones: 1, rug: 1 },
    },
  },
  {
    id: "creator",
    name: "Creator Studio",
    description: "Cozy, plants, good light",
    setup: {
      desk: "teak",
      chair: "flow",
      accessories: { monitor: 2, laptopStand: 1, lamp: 1, floorPlant: 1, shelf: 1, rug: 1, deskPlant: 1 },
    },
  },
];

export function qty(setup: Setup, id: AccessoryId) {
  return setup.accessories[id] ?? 0;
}

export type LineItem = { key: string; name: string; detail: string; quantity: number; monthly: number };

export function lineItems(setup: Setup): LineItem[] {
  const desk = deskById(setup.desk);
  const chair = chairById(setup.chair);
  const items: LineItem[] = [
    { key: "desk", name: desk.name, detail: "Desk", quantity: 1, monthly: desk.monthly },
    { key: "chair", name: chair.name, detail: "Chair", quantity: 1, monthly: chair.monthly },
  ];
  for (const acc of ACCESSORIES) {
    const q = qty(setup, acc.id);
    if (q > 0) items.push({ key: acc.id, name: acc.name, detail: acc.group, quantity: q, monthly: acc.monthly * q });
  }
  return items;
}

export function pricing(setup: Setup, durationId: DurationId) {
  const duration = DURATIONS.find((d) => d.id === durationId)!;
  const monthly = lineItems(setup).reduce((sum, item) => sum + item.monthly, 0);
  const rental = monthly * duration.months * (1 - duration.discount);
  const savings = monthly * duration.months * duration.discount;
  const delivery = monthly >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { monthly, rental, savings, delivery, total: rental + delivery, duration };
}

/** Keeps a setup valid after a change, e.g. too many monitors for a small desk. */
export function normalize(setup: Setup): { setup: Setup; notice?: string } {
  const desk = deskById(setup.desk);
  const monitors = qty(setup, "monitor");
  if (monitors > desk.maxMonitors) {
    return {
      setup: { ...setup, accessories: { ...setup.accessories, monitor: desk.maxMonitors } },
      notice: `${desk.name} fits up to ${desk.maxMonitors} monitors, so we kept ${desk.maxMonitors}.`,
    };
  }
  return { setup };
}

const ACC_IDS = new Set(ACCESSORIES.map((a) => a.id));

/** Readable query string (ids are URL-safe), e.g. `desk=lift&chair=mesh&items=monitor:2,lamp`. */
export function encodeSetup(setup: Setup): string {
  const acc = ACCESSORIES.map((a) => [a.id, qty(setup, a.id)] as const)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => (q === 1 ? id : `${id}:${q}`))
    .join(",");
  return `desk=${setup.desk}&chair=${setup.chair}${acc ? `&items=${acc}` : ""}`;
}

export function decodeSetup(search: string): Setup | null {
  const params = new URLSearchParams(search);
  const desk = params.get("desk") as DeskId | null;
  const chair = params.get("chair") as ChairId | null;
  if (!desk || !chair || !DESKS.some((d) => d.id === desk) || !CHAIRS.some((c) => c.id === chair)) return null;

  const accessories: Setup["accessories"] = {};
  for (const token of (params.get("items") ?? "").split(",").filter(Boolean)) {
    const [id, q] = token.split(":");
    if (!ACC_IDS.has(id as AccessoryId)) continue;
    const max = accessoryById(id as AccessoryId).maxQty;
    accessories[id as AccessoryId] = Math.min(max, Math.max(1, Number(q) || 1));
  }
  return normalize({ desk, chair, accessories }).setup;
}

export function sameSetup(a: Setup, b: Setup) {
  return encodeSetup(a) === encodeSetup(b);
}
