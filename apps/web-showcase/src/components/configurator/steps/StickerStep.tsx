"use client";

import { useRef } from "react";
import type { ProductConfig, LogoElement } from "@configurator/core";
import { MOBILECASE_TEXT_POSITIONS } from "@configurator/core";
import PlacedElementCard from "@/components/shared/PlacedElementCard";

interface StickerStepProps {
  productConfig: ProductConfig;
  // Sticker form state
  mobileLogoWidth: number;
  setMobileLogoWidth: (v: number) => void;
  mobileLogoHeight: number;
  setMobileLogoHeight: (v: number) => void;
  mobileLogoPositionName: string;
  setMobileLogoPositionName: (v: string) => void;
  // Step flow
  stickerStepEnabled: boolean | null;
  setStickerStepEnabled: (v: boolean | null) => void;
  showMobileLogoAddForm: boolean;
  setShowMobileLogoAddForm: (v: boolean) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  // Handlers
  handleAddMobileLogo: (logoUrl: string, positionName: string) => Promise<void>;
  handleUpdateLogoOffset: (elementIndex: number, appIndex: number, x: number, y: number) => void;
  handleRemoveElement: (index: number) => void;
}

export default function StickerStep({
  productConfig,
  mobileLogoWidth,
  setMobileLogoWidth,
  mobileLogoHeight,
  setMobileLogoHeight,
  mobileLogoPositionName,
  setMobileLogoPositionName,
  stickerStepEnabled,
  setStickerStepEnabled,
  showMobileLogoAddForm,
  setShowMobileLogoAddForm,
  setCurrentStep,
  handleAddMobileLogo,
  handleUpdateLogoOffset,
  handleRemoveElement,
}: StickerStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-1">Add Logo</h3>
          <p className="text-xs text-zinc-500">Upload an image for your mobile case</p>
        </div>
      </div>

      {/* Yes/No prompt */}
      {stickerStepEnabled === null && (
        <div className="text-center py-8 space-y-4">
          <p className="text-sm text-zinc-400">Do you want to add a logo?</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setStickerStepEnabled(true)}
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

      {stickerStepEnabled === true && (
        <>
          {/* Add logo form */}
          {(productConfig.elements.filter((e) => e.type === "logo").length === 0 || showMobileLogoAddForm) && (
            <>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={mobileLogoPositionName}
                    onChange={(e) => setMobileLogoPositionName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded border border-zinc-700 bg-zinc-950 text-zinc-300 focus:outline-none focus:border-blue-500"
                  >
                    {Object.keys(MOBILECASE_TEXT_POSITIONS).map((pos) => (
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
                      value={mobileLogoWidth}
                      onChange={(e) => setMobileLogoWidth(parseFloat(e.target.value || "0"))}
                      className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-mono text-zinc-500">Height (px)</label>
                    <input
                      type="number"
                      min={20}
                      max={400}
                      value={mobileLogoHeight}
                      onChange={(e) => setMobileLogoHeight(parseFloat(e.target.value || "0"))}
                      className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-2">Upload Logo Image</h4>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          handleAddMobileLogo(event.target.result as string, mobileLogoPositionName);
                        }
                      };
                      reader.readAsDataURL(file);
                      e.target.value = "";
                    }}
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
          {productConfig.elements.filter((e) => e.type === "logo").length > 0 && !showMobileLogoAddForm && (
            <button
              onClick={() => setShowMobileLogoAddForm(true)}
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
                    key={`mobilelogo-${ei}-${ai}`}
                    elementIndex={ei}
                    appIndex={ai}
                    positionName={app.positionName}
                    elementName={el.name}
                    offsetX={app.offsetX}
                    offsetY={app.offsetY}
                    onOffsetChange={handleUpdateLogoOffset}
                    onRemove={handleRemoveElement}
                    showColorDot={false}
                  />
                ));
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
