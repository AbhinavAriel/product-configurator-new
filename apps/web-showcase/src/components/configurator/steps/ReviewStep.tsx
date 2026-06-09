"use client";

import type { ProductConfig, ProductType } from "@configurator/core";

interface ReviewStepProps {
  selectedProduct: ProductType;
  productConfig: ProductConfig;
  canvasLayers: any[];
  selectedLayerId: string | null;
  selectLayer: (layer: any) => void;
  handleExport: () => Promise<void>;
  handleExportConfig: () => void;
  handleBringToFront: () => void;
  handleSendToBack: () => void;
  handleDuplicateSelected: () => void;
  handleDeleteSelected: () => void;
}

export default function ReviewStep({
  selectedProduct,
  productConfig,
  canvasLayers,
  selectedLayerId,
  selectLayer,
  handleExport,
  handleExportConfig,
  handleBringToFront,
  handleSendToBack,
  handleDuplicateSelected,
  handleDeleteSelected,
}: ReviewStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-1">Review Your Design</h3>
        <p className="text-xs text-zinc-500">Manage layers and export your creation</p>
      </div>

      {/* Config summary */}
      {(selectedProduct === "tshirt" || selectedProduct === "bag") && (
        <div className="space-y-2 p-3 rounded-lg border border-zinc-800 bg-zinc-950">
          <h4 className="text-[11px] font-mono font-bold text-zinc-500 uppercase">Product Config</h4>
          <div className="text-[10px] text-zinc-400 space-y-1">
            <p>Product: {productConfig.product.productName}</p>
            {selectedProduct === "tshirt" && (
              <p>
                {productConfig.product.productLengthDesc}: {productConfig.product.sleeveLength}
              </p>
            )}
            <p>Layers: {(productConfig.materials || []).length}</p>
            <p>Elements: {productConfig.elements.length}</p>
          </div>
        </div>
      )}

      {/* Canvas Layers */}
      {canvasLayers.length === 0 ? (
        <div className="text-center py-8 border border-zinc-800 border-dashed rounded-xl bg-zinc-950/40">
          <span className="text-xs text-zinc-500 block">No custom items added yet</span>
          <span className="text-[10px] text-zinc-600">Go back and add text or stickers!</span>
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="text-[11px] font-mono font-bold text-zinc-500 uppercase">
            Layers ({canvasLayers.length})
          </h4>
          <div className="space-y-1 max-h-45 overflow-y-auto pr-1">
            {canvasLayers.map((layer) => (
              <div
                key={layer.id}
                onClick={() => selectLayer(layer)}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition cursor-pointer ${
                  selectedLayerId === layer.id
                    ? "bg-zinc-800 border-blue-500 text-blue-300"
                    : "bg-zinc-950 border-zinc-800 hover:bg-zinc-900/60 text-zinc-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold font-mono bg-zinc-900 border border-zinc-700 text-zinc-400">
                    {layer.type}
                  </span>
                  <span className="text-xs font-semibold max-w-[150px] truncate">{layer.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleBringToFront}
              disabled={!selectedLayerId}
              className="py-2 rounded text-[11px] font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Bring to Front
            </button>
            <button
              onClick={handleSendToBack}
              disabled={!selectedLayerId}
              className="py-2 rounded text-[11px] font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Send to Back
            </button>
            <button
              onClick={handleDuplicateSelected}
              disabled={!selectedLayerId}
              className="py-2 rounded text-[11px] font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Duplicate
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={!selectedLayerId}
              className="py-2 rounded text-[11px] font-bold border border-red-950 bg-red-950/20 text-red-400 hover:bg-red-950/40 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="h-px bg-zinc-800" />

      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Export</h4>
        <button
          onClick={handleExport}
          className="w-full py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg glow-btn flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download High-Res PNG
        </button>
        <button
          onClick={handleExportConfig}
          className="w-full py-3 rounded-xl text-sm font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Config JSON
        </button>
      </div>
    </div>
  );
}
