"use client";

import type { ProductConfig, ProductType, MaterialLayer } from "@configurator/core";
import { PRESET_PALETTES } from "@configurator/core";

interface ColorStepProps {
  selectedProduct: ProductType;
  productConfig: ProductConfig;
  setProductConfig: React.Dispatch<React.SetStateAction<ProductConfig>>;
  updateMaterialColor: (layerName: string, colourHex: string) => void;
}

export default function ColorStep({
  selectedProduct,
  productConfig,
  setProductConfig,
  updateMaterialColor,
}: ColorStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-1">Layer Colors</h3>
        <p className="text-xs text-zinc-500">Customize each part of the product</p>
      </div>

      {/* Mobile Case specific: Back Color Presets + Pattern */}
      {selectedProduct === "mobilecase" && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Back Color Presets</h4>
          <div className="flex flex-wrap gap-2">
            {PRESET_PALETTES.flatMap((p) => p.colors).map((color) => {
              const currentBackColor =
                (productConfig.materials || []).find((m) => m.layerName === "Back Color")?.colourHex || "#ffffff";
              return (
                <button
                  key={color.hex}
                  onClick={() => updateMaterialColor("Back Color", color.hex)}
                  title={color.name}
                  style={{ backgroundColor: color.hex }}
                  className={`w-9 h-9 rounded-full transition-all duration-300 border ${
                    currentBackColor.toLowerCase() === color.hex.toLowerCase()
                      ? "ring-2 ring-blue-500 scale-110 border-white/60"
                      : "border-zinc-700 hover:scale-110"
                  }`}
                />
              );
            })}
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Back Pattern</h4>
            <div className="flex gap-1.5">
              {["none", "lines", "dots", "waves"].map((p) => (
                <button
                  key={p}
                  onClick={() => setProductConfig((prev) => ({ ...prev, pattern: p }))}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold border transition ${
                    (productConfig.pattern || "none") === p
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {p === "none" ? "None" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            {productConfig.pattern && productConfig.pattern !== "none" && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Pattern Color</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={productConfig.patternColor || "#000000"}
                    onChange={(e) => setProductConfig((prev) => ({ ...prev, patternColor: e.target.value }))}
                    className="w-10 h-10 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={productConfig.patternColor || "#000000"}
                    onChange={(e) => setProductConfig((prev) => ({ ...prev, patternColor: e.target.value }))}
                    maxLength={7}
                    placeholder="#000000"
                    className="flex-1 px-3 py-1.5 text-xs font-semibold rounded border border-zinc-700 bg-zinc-950 focus:outline-none focus:border-blue-500 font-mono text-zinc-200"
                  />
                </div>
              </div>
            )}
            <div className="h-px bg-zinc-800" />
          </div>
        </div>
      )}

      {/* Material Layer Color Pickers — all products */}
      <div className="space-y-4">
        {(productConfig.materials || []).map((mat) => (
          <div key={mat.layerName}>
            <label className="text-xs font-mono font-bold uppercase text-zinc-400">{mat.layerName}</label>
            <div className="flex gap-2 mt-1 items-center">
              <input
                type="color"
                value={mat.colourHex || "#000000"}
                onChange={(e) => updateMaterialColor(mat.layerName, e.target.value)}
                className="w-10 h-10 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={mat.colourHex}
                onChange={(e) => updateMaterialColor(mat.layerName, e.target.value)}
                maxLength={7}
                placeholder="No color"
                className="flex-1 px-3 py-1.5 text-xs font-semibold rounded border border-zinc-700 bg-zinc-950 focus:outline-none focus:border-blue-500 font-mono text-zinc-200"
              />
              <span className="text-[10px] text-zinc-500 font-mono w-20 text-right truncate">
                {mat.colourName}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-zinc-800" />
    </div>
  );
}
