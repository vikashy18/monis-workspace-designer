export type DeskId = "teak" | "lift" | "compact";
export type ChairId = "mesh" | "rattan" | "flow";
export type AccessoryId =
  | "monitor"
  | "laptopStand"
  | "lamp"
  | "keyboard"
  | "deskPlant"
  | "headphones"
  | "floorPlant"
  | "rug"
  | "shelf"
  | "fan";

export type Desk = {
  id: DeskId;
  name: string;
  tagline: string;
  specs: string;
  monthly: number;
  width: number;
  height: number;
  maxMonitors: number;
  adjustable?: boolean;
};

export type Chair = {
  id: ChairId;
  name: string;
  tagline: string;
  specs: string;
  monthly: number;
};

export type Accessory = {
  id: AccessoryId;
  name: string;
  tagline: string;
  monthly: number;
  group: "On the desk" | "Around the room";
  maxQty: number;
};

export const DESKS: Desk[] = [
  {
    id: "teak",
    name: "Teak Classic",
    tagline: "Warm Indonesian teak with drawers",
    specs: "140 × 70 cm · fixed height",
    monthly: 650_000,
    width: 460,
    height: 140,
    maxMonitors: 3,
  },
  {
    id: "lift",
    name: "Lift Pro",
    tagline: "Electric sit/stand desk",
    specs: "140 × 70 cm · 72–120 cm",
    monthly: 1_100_000,
    width: 440,
    height: 140,
    maxMonitors: 3,
    adjustable: true,
  },
  {
    id: "compact",
    name: "Nomad Compact",
    tagline: "Birch top that fits any villa corner",
    specs: "100 × 60 cm · fixed height",
    monthly: 400_000,
    width: 320,
    height: 135,
    maxMonitors: 2,
  },
];

export const CHAIRS: Chair[] = [
  {
    id: "mesh",
    name: "ErgoMesh",
    tagline: "Full ergonomic with headrest",
    specs: "Lumbar support · 4D arms",
    monthly: 750_000,
  },
  {
    id: "flow",
    name: "Flow Task",
    tagline: "Soft fabric, all-day comfy",
    specs: "Tilt lock · height adjust",
    monthly: 500_000,
  },
  {
    id: "rattan",
    name: "Rattan Lounge",
    tagline: "Handwoven in Bali, island vibes",
    specs: "Cushioned seat · no wheels",
    monthly: 350_000,
  },
];

export const ACCESSORIES: Accessory[] = [
  { id: "monitor", name: '27" 4K Monitor', tagline: "USB-C, one cable to your laptop", monthly: 450_000, group: "On the desk", maxQty: 3 },
  { id: "laptopStand", name: "Laptop Stand", tagline: "Raise your laptop to eye level", monthly: 100_000, group: "On the desk", maxQty: 1 },
  { id: "keyboard", name: "Keyboard & Mouse", tagline: "Wireless, quiet keys", monthly: 150_000, group: "On the desk", maxQty: 1 },
  { id: "lamp", name: "Architect Lamp", tagline: "Warm light for late calls", monthly: 120_000, group: "On the desk", maxQty: 1 },
  { id: "headphones", name: "ANC Headphones", tagline: "Block out the scooters", monthly: 200_000, group: "On the desk", maxQty: 1 },
  { id: "deskPlant", name: "Desk Succulent", tagline: "Low effort, high vibes", monthly: 60_000, group: "On the desk", maxQty: 1 },
  { id: "floorPlant", name: "Monstera", tagline: "Big, leafy, very Bali", monthly: 120_000, group: "Around the room", maxQty: 1 },
  { id: "rug", name: "Woven Rug", tagline: "Softens tile floors", monthly: 150_000, group: "Around the room", maxQty: 1 },
  { id: "shelf", name: "Wall Shelf", tagline: "Books, speaker, trinkets", monthly: 140_000, group: "Around the room", maxQty: 1 },
  { id: "fan", name: "Standing Fan", tagline: "Because it's 31°C outside", monthly: 180_000, group: "Around the room", maxQty: 1 },
];

export type DurationId = "week" | "month" | "quarter" | "half";

export const DURATIONS: { id: DurationId; label: string; months: number; discount: number }[] = [
  { id: "week", label: "1 week", months: 0.35, discount: 0 },
  { id: "month", label: "1 month", months: 1, discount: 0 },
  { id: "quarter", label: "3 months", months: 3, discount: 0.1 },
  { id: "half", label: "6 months", months: 6, discount: 0.15 },
];

export const FREE_DELIVERY_FROM = 1_500_000;
export const DELIVERY_FEE = 150_000;

export const AREAS = ["Canggu", "Pererenan", "Seminyak", "Ubud", "Uluwatu", "Sanur", "Other"];

export const deskById = (id: DeskId) => DESKS.find((d) => d.id === id)!;
export const chairById = (id: ChairId) => CHAIRS.find((c) => c.id === id)!;
export const accessoryById = (id: AccessoryId) => ACCESSORIES.find((a) => a.id === id)!;

const idr = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
export const formatIDR = (value: number) => idr.format(Math.round(value / 1000) * 1000);
