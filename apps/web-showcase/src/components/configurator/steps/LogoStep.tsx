"use client";

import { useRef } from "react";
import type { ProductConfig, ProductType, LogoElement } from "@configurator/core";
import { getPositionsForProduct } from "@configurator/core";
import type { ConfiguratorEngine } from "@configurator/core";
import PlacedElementCard from "@/components/shared/PlacedElementCard";

interface LogoStepProps {
  selectedProduct: ProductType;
  productConfig: ProductConfig;
  engineRef: React.RefObject<ConfiguratorEngine | null>;
  // Logo form state
  logoWidth: number;
  setLogoWidth: (v: number) => void;
  logoHeight: number;
  setLogoHeight: (v: number) => void;
  logoPosition: string;
  setLogoPosition: (v: string) => void;
  // Step flow
  logoStepEnabled: boolean | null;
  setLogoStepEnabled: (v: boolean | null) => void;
  showLogoAddForm: boolean;
  setShowLogoAddForm: (v: boolean) => void;
  selectedObjectType: string | null;
  selectedImageWidth: number;
  setSelectedImageWidth: (v: number) => void;
  selectedImageHeight: number;
  setSelectedImageHeight: (v: number) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  // Handlers
  handleAddLogo: (logoUrl: string, positionName: string) => Promise<void>;
  handleUpdateLogoOffset: (elementIndex: number, appIndex: number, x: number, y: number) => void;
  handleRemoveElement: (index: number) => void;
}

export default function LogoStep({
  selectedProduct,
  productConfig,
  engineRef,
  logoWidth,
  setLogoWidth,
  logoHeight,
  setLogoHeight,
  logoPosition,
  setLogoPosition,
  logoStepEnabled,
  setLogoStepEnabled,
  showLogoAddForm,
  setShowLogoAddForm,
  selectedObjectType,
  selectedImageWidth,
  setSelectedImageWidth,
  selectedImageHeight,
  setSelectedImageHeight,
  setCurrentStep,
  handleAddLogo,
  handleUpdateLogoOffset,
  handleRemoveElement,
}: LogoStepProps) {
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const { positions } = getPositionsForProduct(selectedProduct);

  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleAddLogo(event.target.result as string, logoPosition);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-1">Add Logo</h3>
          <p className="text-xs text-zinc-500 font-medium">Place a logo on your design</p>
        </div>
      </div>

      {/* Yes/No prompt */}
      {logoStepEnabled === null && (
        <div className="text-center py-8 space-y-4">
          <p className="text-sm text-zinc-400">Do you want to add a logo?</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setLogoStepEnabled(true)}
              className="px-6 py-2.5 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition glow-btn"
            >
              Yes, Add Logo
            </button>
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-6 py-2.5 rounded text-xs font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 transition"
            >
              No, Skip
            </button>
          </div>
        </div>
      )}

      {logoStepEnabled === true && (
        <>
          {/* Add logo form */}
          {(productConfig.elements.filter((e) => e.type === "logo").length === 0 || showLogoAddForm) && (
            <>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    id="logo-position"
                    value={logoPosition}
                    onChange={(e) => setLogoPosition(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded border border-zinc-700 bg-zinc-950 text-zinc-300 focus:outline-none focus:border-blue-500"
                  >
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[9px] font-mono text-zinc-500">Width (px)</label>
                    <input
                      type="number"
                      min={20}
                      max={400}
                      value={logoWidth}
                      onChange={(e) => setLogoWidth(parseFloat(e.target.value || "0"))}
                      className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-mono text-zinc-500">Height (px)</label>
                    <input
                      type="number"
                      min={20}
                      max={400}
                      value={logoHeight}
                      onChange={(e) => setLogoHeight(parseFloat(e.target.value || "0"))}
                      className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="h-px bg-zinc-800" />

              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-2">Upload Custom Logo</h4>
                <div
                  onClick={() => logoFileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition"
                >
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span className="text-xs font-bold text-blue-400">Upload PNG, JPG</span>
                </div>
              </div>
            </>
          )}

          {/* Add another logo button */}
          {productConfig.elements.filter((e) => e.type === "logo").length > 0 && !showLogoAddForm && (
            <button
              onClick={() => setShowLogoAddForm(true)}
              className="w-full py-2.5 rounded text-xs font-bold border border-dashed border-zinc-600 text-zinc-400 hover:border-blue-500 hover:text-blue-400 transition"
            >
              + Add Another Logo
            </button>
          )}

          <div className="h-px bg-zinc-800" />

          {/* Placed Logos List */}
          {productConfig.elements.filter((e) => e.type === "logo").length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Placed Logos</h4>
              {productConfig.elements.map((el, ei) => {
                if (el.type !== "logo") return null;
                return el.applications.map((app, ai) => (
                  <PlacedElementCard
                    key={`logo-${ei}-${ai}`}
                    elementIndex={ei}
                    appIndex={ai}
                    positionName={app.positionName}
                    elementName={el.name}
                    offsetX={app.offsetX}
                    offsetY={app.offsetY}
                    onOffsetChange={handleUpdateLogoOffset}
                    onRemove={handleRemoveElement}
                  />
                ));
              })}
            </div>
          )}

          {/* Selected Image Resize Controls */}
          {selectedObjectType === "image" && (
            <div className="space-y-2 p-3 rounded-lg border border-zinc-800 bg-zinc-950/60">
              <h4 className="text-[10px] font-mono font-bold uppercase text-zinc-500">Selected Image</h4>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[9px] font-mono text-zinc-500">Width</label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={selectedImageWidth || ""}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value || "0");
                      if (v > 0) {
                        engineRef.current?.updateSelectedSticker({ width: v });
                        setSelectedImageWidth(v);
                      }
                    }}
                    className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-mono text-zinc-500">Height</label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={selectedImageHeight || ""}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value || "0");
                      if (v > 0) {
                        engineRef.current?.updateSelectedSticker({ height: v });
                        setSelectedImageHeight(v);
                      }
                    }}
                    className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
