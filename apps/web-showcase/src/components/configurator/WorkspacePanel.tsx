"use client";

import type { ProductConfig, ProductType } from "@configurator/core";
import TshirtPreview, { type TshirtVariant } from "@/components/JerseyPreview";
import BagPreview from "@/components/BagPreview";
import ShortsPreview from "@/components/ShortsPreview";
import MobileCasePreview from "@/components/MobileCasePreview";
import ConfiguratorViewer from "@/components/ConfiguratorViewer";

interface WorkspacePanelProps {
  selectedProduct: ProductType;
  productConfig: ProductConfig;
  tshirtVariant: TshirtVariant;
  activeView: "back" | "front";
  setActiveView: React.Dispatch<React.SetStateAction<"back" | "front">>;
  handleBackToHome: () => void;
  handleExportConfig: () => void;
  handleClearCanvas: () => void;
  handleExportPng: () => Promise<void>;
  handleEngineReady: (eng: any) => void;
}

export default function WorkspacePanel({
  selectedProduct,
  productConfig,
  tshirtVariant,
  activeView,
  setActiveView,
  handleBackToHome,
  handleExportConfig,
  handleClearCanvas,
  handleExportPng,
  handleEngineReady,
}: WorkspacePanelProps) {
  return (
    <section className="flex-1 relative flex flex-col items-center justify-between p-6 md:p-8 checkerboard-grid border-b md:border-b-0 md:border-r border-zinc-800 overflow-hidden">
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={handleBackToHome} className="text-zinc-500 hover:text-zinc-300 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold font-mono">
              Custom Studio
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white">
              {selectedProduct === "mobilecase" ? "Impact Cover Pro" : productConfig.product.productName}
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportConfig}
            className="px-4 py-2 text-xs font-semibold rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 transition glow-btn cursor-pointer"
          >
            Export JSON
          </button>
          <button
            onClick={handleClearCanvas}
            className="px-4 py-2 text-xs font-semibold rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 transition glow-btn cursor-pointer"
          >
            Clear Canvas
          </button>
          <button
            onClick={handleExportPng}
            className="px-5 py-2 text-xs font-bold rounded-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg glow-btn"
          >
            Export PNG
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {selectedProduct === "tshirt" ? (
            <TshirtPreview materials={productConfig.materials || []} variant={tshirtVariant} />
          ) : selectedProduct === "bag" ? (
            <BagPreview materials={productConfig.materials || []} />
          ) : selectedProduct === "shorts" ? (
            <ShortsPreview materials={productConfig.materials || []} />
          ) : (
            <MobileCasePreview
              materials={productConfig.materials || []}
              activeView={activeView}
              pattern={productConfig.pattern}
              patternColor={productConfig.patternColor}
            />
          )}

          <div
            className="absolute inset-0"
            style={{
              visibility: selectedProduct === "mobilecase" && activeView !== "back" ? "hidden" : "visible",
              pointerEvents: selectedProduct === "mobilecase" && activeView !== "back" ? "none" : "auto",
            }}
          >
            <ConfiguratorViewer onEngineReady={handleEngineReady} />
          </div>
        </div>
      </div>

      {selectedProduct === "mobilecase" && (
        <div className="flex items-center gap-6 z-10 bg-zinc-900/70 border border-zinc-800 p-2.5 rounded-full backdrop-blur-md shadow-2xl">
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveView("back")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${activeView === "back" ? "bg-blue-600 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"
                }`}
            >
              Back Case
            </button>
            <button
              onClick={() => setActiveView("front")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${activeView === "front" ? "bg-blue-600 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"
                }`}
            >
              Front Glass
            </button>
          </div>
          <div className="h-4 w-px bg-zinc-800" />

        </div>
      )}
    </section>
  );
}
