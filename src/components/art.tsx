"use client";

import { ReactNode, useId } from "react";
import type { AccessoryId, ChairId, Desk } from "@/lib/catalog";

function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

/* ---------------------------------- Desks --------------------------------- */
/* Origin: floor, horizontal center. `children` render on the moving desktop
   layer, so items lift together with the Lift Pro top. */

export const surfaceY = (desk: Desk) => -desk.height - 7;

export function DeskArt({ desk, lift = 0, children }: { desk: Desk; lift?: number; children?: ReactNode }) {
  const { width: w, height: h } = desk;
  const half = w / 2;
  const layer = { transform: `translateY(${lift}px)`, transition: "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)" };

  if (desk.id === "lift") {
    const colX = half - 46;
    return (
      <g>
        <g style={layer}>
          {[-colX, colX].map((x) => (
            <rect key={x} x={x - 6} y={-h + 12} width={12} height={h - 17} fill="#9ca3af" />
          ))}
          <rect x={-colX} y={-h + 12} width={colX * 2} height={8} fill="#4b5563" />
          <DesktopSurface w={w} h={h} top="#f7f5f0" edge="#e2ded5" />
          <rect x={half - 70} y={-h + 3} width={34} height={6} rx={2} fill="#374151" />
          <circle cx={half - 44} cy={-h + 6} r={1.6} fill="#34d399" />
          {children}
        </g>
        {[-colX, colX].map((x) => (
          <g key={x}>
            <rect x={x - 9} y={-72} width={18} height={68} rx={2} fill="#374151" />
            <rect x={x - 38} y={-7} width={76} height={7} rx={3} fill="#1f2937" />
          </g>
        ))}
      </g>
    );
  }

  if (desk.id === "compact") {
    const a = half - 34;
    return (
      <g style={layer}>
        {[-a, a - 14].map((x) => (
          <path
            key={x}
            d={`M ${x} ${-h + 10} L ${x + 7} 0 L ${x + 14} ${-h + 10}`}
            stroke="#1f2937"
            strokeWidth={3}
            fill="none"
            strokeLinejoin="round"
          />
        ))}
        <DesktopSurface w={w} h={h} top="#e8cfa6" edge="#c9a978" thickness={9} />
        {children}
      </g>
    );
  }

  return (
    <g style={layer}>
      {[-half + 10, half - 24].map((x) => (
        <rect key={x} x={x} y={-h + 12} width={14} height={h - 12} fill="#8a5a33" />
      ))}
      <rect x={-half + 24} y={-h + 12} width={112} height={72} fill="#9a6a40" />
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x={-half + 30} y={-h + 18 + i * 34} width={100} height={28} rx={2} fill="#b07a4a" />
          <rect x={-half + 68} y={-h + 30 + i * 34} width={24} height={4} rx={2} fill="#5b3a1f" />
        </g>
      ))}
      <DesktopSurface w={w} h={h} top="#c08955" edge="#9a6a40" grain />
      {children}
    </g>
  );
}

function DesktopSurface({
  w,
  h,
  top,
  edge,
  thickness = 12,
  grain,
}: {
  w: number;
  h: number;
  top: string;
  edge: string;
  thickness?: number;
  grain?: boolean;
}) {
  const half = w / 2;
  return (
    <g>
      <polygon points={`${-half + 14},${-h - 14} ${half - 14},${-h - 14} ${half},${-h} ${-half},${-h}`} fill={top} />
      {grain &&
        [0.3, 0.6].map((t) => (
          <line
            key={t}
            x1={-half + 30}
            x2={half - 60}
            y1={-h - 14 + 14 * t}
            y2={-h - 14 + 14 * t}
            stroke="#a8743f"
            strokeWidth={0.8}
            opacity={0.5}
          />
        ))}
      <rect x={-half} y={-h} width={w} height={thickness} rx={2} fill={edge} />
    </g>
  );
}

/* --------------------------------- Chairs --------------------------------- */
/* Origin: floor, horizontal center. */

function StarBase({ color = "#1f2937" }: { color?: string }) {
  const wheels = [-48, -24, 0, 24, 48];
  return (
    <g>
      <rect x={-4} y={-54} width={8} height={40} fill="#4b5563" />
      {wheels.map((x) => (
        <line key={x} x1={0} y1={-16} x2={x} y2={-8} stroke={color} strokeWidth={5} strokeLinecap="round" />
      ))}
      {wheels.map((x) => (
        <circle key={x} cx={x} cy={-5} r={5} fill="#111827" />
      ))}
    </g>
  );
}

export function ChairArt({ id }: { id: ChairId }) {
  const pattern = useSvgId("chair");

  if (id === "rattan") {
    return (
      <g>
        <defs>
          <pattern id={pattern} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={8} height={8} fill="#d9ab6f" />
            <line x1={0} y1={4} x2={8} y2={4} stroke="#a8743f" strokeWidth={1.4} />
            <line x1={4} y1={0} x2={4} y2={8} stroke="#b9854c" strokeWidth={1.4} />
          </pattern>
        </defs>
        {[-44, -20, 20, 44].map((x) => (
          <line key={x} x1={x * 0.9} y1={-50} x2={x} y2={0} stroke="#8a5a33" strokeWidth={5} strokeLinecap="round" />
        ))}
        <path d="M -62 -56 C -70 -118 -40 -162 0 -162 C 40 -162 70 -118 62 -56 Z" fill={`url(#${pattern})`} stroke="#8a5a33" strokeWidth={3} />
        <rect x={-58} y={-68} width={116} height={20} rx={9} fill="#f5efe0" stroke="#e4dac3" />
        <rect x={-34} y={-118} width={68} height={44} rx={14} fill="#efe6d2" opacity={0.95} />
      </g>
    );
  }

  if (id === "flow") {
    return (
      <g>
        <StarBase color="#374151" />
        <rect x={-3} y={-100} width={6} height={36} fill="#4b5563" />
        <rect x={-40} y={-148} width={80} height={78} rx={32} fill="#6b7280" />
        <rect x={-30} y={-138} width={60} height={58} rx={24} fill="#7c8592" />
        <rect x={-48} y={-70} width={96} height={18} rx={9} fill="#9ca3af" />
      </g>
    );
  }

  return (
    <g>
      <defs>
        <pattern id={pattern} width={6} height={6} patternUnits="userSpaceOnUse">
          <rect width={6} height={6} fill="#1f2937" />
          <path d="M0 0 L6 6 M6 0 L0 6" stroke="#374151" strokeWidth={0.8} />
        </pattern>
      </defs>
      <StarBase />
      <rect x={-4} y={-162} width={8} height={14} fill="#111827" />
      <rect x={-24} y={-178} width={48} height={18} rx={8} fill="#111827" />
      <rect x={-38} y={-150} width={76} height={80} rx={16} fill={`url(#${pattern})`} stroke="#111827" strokeWidth={3} />
      <rect x={-24} y={-100} width={48} height={10} rx={5} fill="#111827" opacity={0.8} />
      <rect x={-46} y={-70} width={92} height={18} rx={9} fill="#111827" />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s * 50 - 2} y={-90} width={4} height={22} fill="#374151" />
          <rect x={s > 0 ? 38 : -66} y={-94} width={28} height={7} rx={3} fill="#111827" />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------ Desk items -------------------------------- */
/* Origin: center of the item's footprint on the desktop. */

export function MonitorArt({ variant = 0 }: { variant?: number }) {
  return (
    <g>
      <ellipse cx={0} cy={-2} rx={22} ry={3.5} fill="#2d2f33" />
      <rect x={-4} y={-28} width={8} height={26} fill="#3a3d42" />
      <rect x={-60} y={-98} width={120} height={72} rx={4} fill="#1d1f23" />
      <ScreenContent variant={variant % 3} />
    </g>
  );
}

function ScreenContent({ variant }: { variant: number }) {
  const x = -56;
  const y = -94;
  if (variant === 1) {
    return (
      <g>
        <rect x={x} y={y} width={112} height={64} fill="#f8fafc" />
        <rect x={x} y={y} width={18} height={64} fill="#e2e8f0" />
        <rect x={x + 26} y={y + 8} width={44} height={30} rx={3} fill="#fb923c" />
        <circle cx={x + 90} cy={y + 22} r={12} fill="#38bdf8" />
        <rect x={x + 26} y={y + 44} width={78} height={5} rx={2} fill="#cbd5e1" />
        <rect x={x + 26} y={y + 53} width={50} height={5} rx={2} fill="#cbd5e1" />
      </g>
    );
  }
  if (variant === 2) {
    const bars = [24, 36, 18, 44, 30, 50];
    return (
      <g>
        <rect x={x} y={y} width={112} height={64} fill="#0b1220" />
        {bars.map((b, i) => (
          <rect key={i} x={x + 10 + i * 16} y={y + 58 - b} width={10} height={b} rx={1.5} fill={i === 5 ? "#34d399" : "#3b82f6"} />
        ))}
      </g>
    );
  }
  const lines = [
    [8, 40, "#c084fc"],
    [16, 62, "#38bdf8"],
    [16, 34, "#fbbf24"],
    [24, 52, "#34d399"],
    [16, 28, "#38bdf8"],
    [8, 46, "#f472b6"],
    [8, 20, "#94a3b8"],
  ] as const;
  return (
    <g>
      <rect x={x} y={y} width={112} height={64} fill="#0f172a" />
      {lines.map(([indent, len, color], i) => (
        <rect key={i} x={x + 6 + indent} y={y + 6 + i * 8} width={len} height={3.5} rx={1.5} fill={color} />
      ))}
    </g>
  );
}

export function LaptopStandArt() {
  return (
    <g>
      <path d="M -22 0 L -12 -26 M 22 0 L 12 -26" stroke="#9ca3af" strokeWidth={3} strokeLinecap="round" />
      <polygon points="-38,-26 38,-26 33,-31 -33,-31" fill="#d1d5db" />
      <rect x={-32} y={-75} width={64} height={44} rx={3} fill="#c9ccd1" />
      <rect x={-29} y={-72} width={58} height={37} rx={1.5} fill="#1e293b" />
      <rect x={-24} y={-66} width={22} height={3} rx={1} fill="#fbbf24" />
      <rect x={-24} y={-60} width={34} height={3} rx={1} fill="#38bdf8" />
      <rect x={-24} y={-54} width={16} height={3} rx={1} fill="#a78bfa" />
    </g>
  );
}

export function KeyboardArt() {
  return (
    <g>
      <polygon points="-56,-9 56,-9 60,-3 -60,-3" fill="#f3f4f6" stroke="#d1d5db" strokeWidth={1} />
      <rect x={-60} y={-3} width={120} height={4} rx={1.5} fill="#d1d5db" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-52 + i * 8.8} y={-7.4} width={6} height={1.6} rx={0.6} fill="#9ca3af" />
      ))}
      <ellipse cx={80} cy={-3} rx={9} ry={4.5} fill="#e5e7eb" stroke="#d1d5db" />
    </g>
  );
}

export function LampArt({ night }: { night?: boolean }) {
  const glow = useSvgId("glow");
  return (
    <g>
      <defs>
        <radialGradient id={glow}>
          <stop offset="0%" stopColor="#fde68a" stopOpacity={night ? 0.85 : 0.45} />
          <stop offset="100%" stopColor="#fde68a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={-78} cy={-30} rx={night ? 90 : 60} ry={night ? 70 : 46} fill={`url(#${glow})`} />
      <ellipse cx={0} cy={-2} rx={16} ry={4} fill="#1f2937" />
      <path d="M 0 -4 L -16 -74 L -58 -104" stroke="#1f2937" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={-16} cy={-74} r={3.5} fill="#374151" />
      <g transform="translate(-62 -100) rotate(32)">
        <path d="M -9 -10 L 9 -10 L 18 10 L -18 10 Z" fill="#111827" />
        <ellipse cx={0} cy={10} rx={14} ry={3.5} fill="#fde68a" />
      </g>
    </g>
  );
}

/** `hanging`: origin is a hook under the desk edge instead of a stand on the desktop. */
export function HeadphonesArt({ hanging }: { hanging?: boolean }) {
  return (
    <g transform={hanging ? "translate(0 64)" : undefined}>
      {hanging ? (
        <path d="M 0 -64 L 0 -69 M -4 -69 L 4 -69" stroke="#374151" strokeWidth={3} strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx={0} cy={-2} rx={12} ry={3} fill="#374151" />
          <rect x={-2} y={-58} width={4} height={56} fill="#6b7280" />
        </>
      )}
      <path d="M -17 -44 A 17 19 0 0 1 17 -44" stroke="#111827" strokeWidth={5} fill="none" strokeLinecap="round" />
      <rect x={-23} y={-50} width={10} height={20} rx={4} fill="#111827" />
      <rect x={13} y={-50} width={10} height={20} rx={4} fill="#111827" />
    </g>
  );
}

export function DeskPlantArt() {
  return (
    <g>
      <polygon points="-11,0 11,0 14,-18 -14,-18" fill="#c2410c" />
      <rect x={-15} y={-21} width={30} height={4} rx={1.5} fill="#9a3412" />
      {[-30, -10, 10, 30, 0].map((r, i) => (
        <ellipse key={i} cx={0} cy={-30} rx={5} ry={13} fill={i === 4 ? "#4d7c0f" : "#65a30d"} transform={`rotate(${r} 0 -20)`} />
      ))}
    </g>
  );
}

/* ------------------------------ Room items -------------------------------- */
/* Origin: floor center (shelf: center of the board on the wall). */

export function FloorPlantArt() {
  const leaves = [
    [-46, -132, -35],
    [40, -142, 30],
    [-14, -168, -8],
    [-56, -96, -60],
    [52, -102, 58],
    [14, -122, 14],
  ];
  return (
    <g>
      {leaves.map(([x, y], i) => (
        <path key={`s${i}`} d={`M 0 -44 Q ${x * 0.3} ${(y - 44) / 2} ${x} ${y + 18}`} stroke="#3f6212" strokeWidth={2.5} fill="none" />
      ))}
      {leaves.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse rx={22} ry={30} fill={i % 2 ? "#15803d" : "#166534"} />
          <path d="M 0 -26 L 0 26 M 0 -6 L -14 -16 M 0 6 L 14 -4 M 0 14 L -12 6" stroke="#bbf7d0" strokeWidth={1.2} opacity={0.6} />
        </g>
      ))}
      <polygon points="-24,0 24,0 30,-46 -30,-46" fill="#f3efe7" stroke="#d6cfc2" />
      <rect x={-32} y={-50} width={64} height={6} rx={2} fill="#e5ded1" />
    </g>
  );
}

export function RugArt() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={240} ry={30} fill="#e7cfa8" />
      <ellipse cx={0} cy={0} rx={220} ry={24} fill="none" stroke="#c99b62" strokeWidth={2} strokeDasharray="6 5" />
      <ellipse cx={0} cy={0} rx={170} ry={17} fill="none" stroke="#d9b07b" strokeWidth={3} />
    </g>
  );
}

export function ShelfArt() {
  const books = [
    [-78, 34, "#ea580c"],
    [-66, 40, "#0f766e"],
    [-54, 30, "#facc15"],
    [-42, 38, "#1d4ed8"],
  ] as const;
  return (
    <g>
      <path d="M -70 0 L -70 14 L -60 0 M 70 0 L 70 14 L 60 0" stroke="#6b4423" strokeWidth={3} fill="none" />
      {books.map(([x, h, c]) => (
        <rect key={x} x={x} y={-h} width={11} height={h} rx={1} fill={c} />
      ))}
      <rect x={-30} y={-30} width={6} height={30} rx={1} fill="#be123c" transform="rotate(-14 -30 0)" />
      <rect x={6} y={-30} width={22} height={30} rx={5} fill="#334155" />
      <circle cx={17} cy={-18} r={6} fill="#64748b" />
      <polygon points="48,0 66,0 68,-14 46,-14" fill="#c2410c" />
      <ellipse cx={57} cy={-24} rx={6} ry={12} fill="#65a30d" />
      <rect x={-92} y={0} width={184} height={7} rx={2} fill="#8a5a33" />
    </g>
  );
}

export function FanArt() {
  return (
    <g>
      <ellipse cx={0} cy={-4} rx={28} ry={6} fill="#cbd5e1" />
      <rect x={-3} y={-150} width={6} height={146} fill="#e2e8f0" />
      <circle cx={0} cy={-176} r={40} fill="#f8fafc" fillOpacity={0.6} stroke="#cbd5e1" strokeWidth={3} />
      <g className="fan-spin">
        {[0, 120, 240].map((r) => (
          <ellipse key={r} cx={0} cy={-196} rx={10} ry={20} fill="#93c5fd" transform={`rotate(${r} 0 -176)`} />
        ))}
      </g>
      <circle cx={0} cy={-176} r={6} fill="#64748b" />
      <path d="M -40 -176 L 40 -176 M 0 -216 L 0 -136" stroke="#cbd5e1" strokeWidth={1} />
    </g>
  );
}

/* ------------------------------ Thumbnails -------------------------------- */

const ACCESSORY_THUMBS: Record<AccessoryId, { viewBox: string; node: ReactNode }> = {
  monitor: { viewBox: "-66 -104 132 110", node: <MonitorArt /> },
  laptopStand: { viewBox: "-44 -82 88 86", node: <LaptopStandArt /> },
  keyboard: { viewBox: "-64 -30 158 40", node: <KeyboardArt /> },
  lamp: { viewBox: "-110 -120 132 124", node: <LampArt /> },
  headphones: { viewBox: "-34 -66 68 70", node: <HeadphonesArt /> },
  deskPlant: { viewBox: "-24 -50 48 54", node: <DeskPlantArt /> },
  floorPlant: { viewBox: "-90 -205 180 210", node: <FloorPlantArt /> },
  rug: { viewBox: "-245 -60 490 95", node: <RugArt /> },
  shelf: { viewBox: "-96 -48 192 66", node: <ShelfArt /> },
  fan: { viewBox: "-46 -222 92 226", node: <FanArt /> },
};

export function AccessoryThumb({ id }: { id: AccessoryId }) {
  const thumb = ACCESSORY_THUMBS[id];
  return (
    <svg viewBox={thumb.viewBox} className="h-full w-full" aria-hidden>
      {thumb.node}
    </svg>
  );
}

export function DeskThumb({ desk }: { desk: Desk }) {
  return (
    <svg viewBox={`${-desk.width / 2 - 8} ${-desk.height - 24} ${desk.width + 16} ${desk.height + 30}`} className="h-full w-full" aria-hidden>
      <DeskArt desk={desk} />
    </svg>
  );
}

export function ChairThumb({ id }: { id: ChairId }) {
  return (
    <svg viewBox="-74 -184 148 190" className="h-full w-full" aria-hidden>
      <ChairArt id={id} />
    </svg>
  );
}
