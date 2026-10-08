"use client";

import { ReactNode, useId } from "react";
import { accessoryById, chairById, deskById } from "@/lib/catalog";
import { Setup, qty } from "@/lib/setup";
import {
  ChairArt,
  DeskArt,
  DeskPlantArt,
  FanArt,
  FloorPlantArt,
  HeadphonesArt,
  KeyboardArt,
  LampArt,
  LaptopStandArt,
  MonitorArt,
  RugArt,
  ShelfArt,
  surfaceY,
} from "./art";

export type PickerTab = "desk" | "chair" | "accessories";

const MONITOR_SLOTS: Record<number, number[]> = { 1: [0], 2: [-66, 66], 3: [-126, 0, 126] };
const STAND_LIFT = -62;

function Place({ x, y, popKey, children }: { x: number; y: number; popKey: string; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g key={popKey} className="pop">
        {children}
      </g>
    </g>
  );
}

export function describeSetup(setup: Setup) {
  const parts = Object.entries(setup.accessories)
    .filter(([, q]) => (q ?? 0) > 0)
    .map(([id, q]) => `${q && q > 1 ? `${q} × ` : ""}${accessoryById(id as never).name}`);
  return `${deskById(setup.desk).name} desk with ${chairById(setup.chair).name} chair${parts.length ? `, ${parts.join(", ")}` : ""}.`;
}

export default function Scene({
  setup,
  standing,
  night,
  onPick,
}: {
  setup: Setup;
  standing: boolean;
  night: boolean;
  onPick: (tab: PickerTab) => void;
}) {
  const desk = deskById(setup.desk);
  const half = desk.width / 2;
  const top = surfaceY(desk);
  const monitors = qty(setup, "monitor");
  const has = (id: Parameters<typeof qty>[1]) => qty(setup, id) > 0;
  const lift = desk.adjustable && standing ? STAND_LIFT : 0;

  const sky = `sky-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const wall = night ? "#2a2b3d" : "#f3e9d8";
  const floor = night ? "#3b3a45" : "#e6d8bf";

  return (
    <svg viewBox="0 0 800 480" className="h-full w-full" role="img" aria-label={`Workspace preview: ${describeSetup(setup)}`}>
      <defs>
        <linearGradient id={sky} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={night ? "#1e1b4b" : "#7dd3fc"} />
          <stop offset="100%" stopColor={night ? "#4c1d95" : "#fde68a"} />
        </linearGradient>
      </defs>

      <rect width={800} height={380} fill={wall} style={{ transition: "fill 0.6s" }} />
      <rect y={368} width={800} height={12} fill={night ? "#23232f" : "#e4d6bf"} />
      <rect y={380} width={800} height={100} fill={floor} style={{ transition: "fill 0.6s" }} />
      {[-300, -100, 100, 300, 500, 700, 900, 1100].map((x) => (
        <line key={x} x1={400 + (x - 400) * 0.55} y1={380} x2={x} y2={480} stroke={night ? "#2f2e38" : "#d6c6aa"} strokeWidth={1} />
      ))}
      {[405, 440].map((y) => (
        <line key={y} x1={0} x2={800} y1={y} y2={y} stroke={night ? "#2f2e38" : "#d6c6aa"} strokeWidth={1} />
      ))}

      {/* Window with a Bali view */}
      <g>
        <rect x={556} y={36} width={208} height={184} rx={6} fill={night ? "#3f3f55" : "#ffffff"} />
        <rect x={566} y={46} width={188} height={164} fill={`url(#${sky})`} />
        <circle cx={night ? 706 : 610} cy={night ? 84 : 120} r={night ? 14 : 22} fill={night ? "#f8fafc" : "#fbbf24"} opacity={0.95} />
        {night &&
          [
            [596, 70],
            [640, 96],
            [670, 62],
            [735, 120],
          ].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r={1.4} fill="#fff" />)}
        <rect x={566} y={168} width={188} height={42} fill={night ? "#1e3a5f" : "#0ea5e9"} opacity={0.85} />
        <path d="M 566 182 Q 610 176 660 182 T 754 182" stroke={night ? "#334e75" : "#bae6fd"} strokeWidth={2} fill="none" />
        <g fill={night ? "#0b1020" : "#14532d"}>
          <path d="M 716 210 Q 712 160 724 118 L 728 118 Q 720 160 722 210 Z" />
          <path d="M 726 120 q -30 -6 -46 10 q 22 -4 46 -6 Z M 726 120 q 26 -16 44 -4 q -22 0 -44 8 Z M 726 120 q -6 -26 -26 -32 q 14 16 22 34 Z M 726 120 q 12 -26 32 -28 q -18 12 -28 30 Z" />
        </g>
        <rect x={658} y={46} width={4} height={164} fill={night ? "#3f3f55" : "#ffffff"} />
        <rect x={566} y={126} width={188} height={4} fill={night ? "#3f3f55" : "#ffffff"} />
      </g>

      {has("shelf") && (
        <Place x={150} y={84} popKey="shelf">
          <ShelfArt />
        </Place>
      )}

      {has("rug") && (
        <Place x={420} y={448} popKey="rug">
          <RugArt />
        </Place>
      )}

      {has("floorPlant") && (
        <Place x={86} y={436} popKey="floorPlant">
          <FloorPlantArt />
        </Place>
      )}

      <g className="cursor-pointer" onClick={() => onPick("desk")}>
        <Place x={400} y={412} popKey={desk.id}>
          <DeskArt desk={desk} lift={lift}>
            {monitors > 0 &&
              MONITOR_SLOTS[monitors].map((dx, i) => (
                <Place key={`m${i}`} x={dx} y={top} popKey={`monitor-${i}`}>
                  <MonitorArt variant={i === 1 || monitors === 1 ? 0 : i === 0 ? 1 : 2} />
                </Place>
              ))}
            {has("lamp") && (
              <Place x={half - 16} y={top} popKey="lamp">
                <LampArt night={night} />
              </Place>
            )}
            {has("headphones") && (
              <Place x={half - 108} y={-desk.height + 12} popKey="headphones">
                <HeadphonesArt hanging />
              </Place>
            )}
            {has("laptopStand") && (
              <Place x={-half + 84} y={top + 3} popKey="laptop">
                <LaptopStandArt />
              </Place>
            )}
            {has("deskPlant") && (
              <Place x={-half + 26} y={top + 1} popKey="deskPlant">
                <DeskPlantArt />
              </Place>
            )}
            {has("keyboard") && (
              <Place x={-24} y={top + 5} popKey="keyboard">
                <KeyboardArt />
              </Place>
            )}
          </DeskArt>
        </Place>
      </g>

      <g className="cursor-pointer" onClick={() => onPick("chair")}>
        <Place x={432} y={462} popKey={setup.chair}>
          <ChairArt id={setup.chair} />
        </Place>
      </g>

      {has("fan") && (
        <Place x={722} y={452} popKey="fan">
          <FanArt />
        </Place>
      )}

      {night && <rect width={800} height={480} fill="#0b1020" opacity={0.12} pointerEvents="none" />}
    </svg>
  );
}
