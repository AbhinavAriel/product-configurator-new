"use client";

import type { LogoApplication, TextApplication } from "@configurator/core";

interface PlacedElementCardProps {
  elementIndex: number;
  appIndex: number;
  positionName: string;
  elementName: string;
  offsetX: number;
  offsetY: number;
  onOffsetChange: (elementIndex: number, appIndex: number, x: number, y: number) => void;
  onRemove: (elementIndex: number) => void;
  showColorDot?: boolean;
}

export default function PlacedElementCard({
  elementIndex,
  appIndex,
  positionName,
  elementName,
  offsetX,
  offsetY,
  onOffsetChange,
  onRemove,
  showColorDot = true,
}: PlacedElementCardProps) {
  const dotColor =
    elementIndex === 0
      ? "bg-blue-400"
      : elementIndex === 1
        ? "bg-green-400"
        : elementIndex === 2
          ? "bg-purple-400"
          : "bg-orange-400";

  return (
    <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showColorDot && <span className={`w-2 h-2 rounded-full ${dotColor}`} />}
          <span className="text-xs font-bold text-zinc-100">{positionName}</span>
        </div>
        <span className="text-[10px] text-zinc-500">{elementName}</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[9px] font-mono text-zinc-500">X</label>
          <input
            type="number"
            value={Number(offsetX.toFixed(2))}
            onChange={(e) => {
              const v = parseFloat(e.target.value || "0");
              onOffsetChange(elementIndex, appIndex, v, offsetY);
            }}
            className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
          />
        </div>
        <div className="flex-1">
          <label className="text-[9px] font-mono text-zinc-500">Y</label>
          <input
            type="number"
            value={Number(offsetY.toFixed(2))}
            onChange={(e) => {
              const v = parseFloat(e.target.value || "0");
              onOffsetChange(elementIndex, appIndex, offsetX, v);
            }}
            className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
          />
        </div>
      </div>
      <button
        onClick={() => onRemove(elementIndex)}
        className="text-[10px] text-red-400 hover:text-red-300 font-bold"
      >
        Remove
      </button>
    </div>
  );
}
