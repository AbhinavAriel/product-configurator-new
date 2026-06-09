"use client";

import { useRef } from "react";
import type { ProductConfig, ProductType, TextElement } from "@configurator/core";
import { FONTS, getPositionsForProduct } from "@configurator/core";
import type { ConfiguratorEngine } from "@configurator/core";
import PlacedElementCard from "@/components/shared/PlacedElementCard";

interface TextStepProps {
  selectedProduct: ProductType;
  productConfig: ProductConfig;
  setProductConfig: React.Dispatch<React.SetStateAction<ProductConfig>>;
  engineRef: React.RefObject<ConfiguratorEngine | null>;
  // Text form state
  textInput: string;
  setTextInput: (v: string) => void;
  textFont: string;
  setTextFont: (v: string) => void;
  textColor: string;
  setTextColor: (v: string) => void;
  textSize: number;
  setTextSize: (v: number) => void;
  isBold: boolean;
  isItalic: boolean;
  textPositionName: string;
  setTextPositionName: (v: string) => void;
  textPositionX: number;
  setTextPositionX: (v: number) => void;
  textPositionY: number;
  setTextPositionY: (v: number) => void;
  textAlignment: "left" | "center" | "right";
  // Step flow
  textStepEnabled: boolean | null;
  setTextStepEnabled: (v: boolean | null) => void;
  showTextAddForm: boolean;
  setShowTextAddForm: (v: boolean) => void;
  selectedObjectType: string | null;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  // Handlers
  handleAddText: () => void;
  handleTextPropertyChange: (property: string, value: any) => void;
  handleRemoveElement: (index: number) => void;
}

export default function TextStep({
  selectedProduct,
  productConfig,
  setProductConfig,
  engineRef,
  textInput,
  setTextInput,
  textFont,
  textColor,
  textSize,
  isBold,
  isItalic,
  textPositionName,
  setTextPositionName,
  textPositionX,
  setTextPositionX,
  textPositionY,
  setTextPositionY,
  textStepEnabled,
  setTextStepEnabled,
  showTextAddForm,
  setShowTextAddForm,
  selectedObjectType,
  setCurrentStep,
  handleAddText,
  handleTextPropertyChange,
  handleRemoveElement,
}: TextStepProps) {
  const { positions, coords } = getPositionsForProduct(selectedProduct);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-1">Add Text</h3>
          <p className="text-xs text-zinc-500 font-medium">Type custom words and style them</p>
        </div>
      </div>

      {/* Yes/No prompt */}
      {textStepEnabled === null && (
        <div className="text-center py-8 space-y-4">
          <p className="text-sm text-zinc-400">Do you want to add custom text?</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setTextStepEnabled(true)}
              className="px-6 py-2.5 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition glow-btn"
            >
              Yes, Add Text
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

      {textStepEnabled === true && (
        <>
          {/* Add text form */}
          {(productConfig.elements.filter((e) => e.type === "text").length === 0 || showTextAddForm) && (
            <div className="space-y-2">
              <textarea
                rows={2}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type custom text..."
                className="w-full px-4 py-3 text-sm font-medium rounded border border-zinc-700 bg-zinc-950 focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500"
              />

              {/* Text Position Buttons */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 font-bold">Position</label>
                <div className="flex flex-wrap gap-1.5">
                  {positions.map((pos) => {
                    const p = coords[pos];
                    return (
                      <button
                        key={pos}
                        onClick={() => {
                          setTextPositionName(pos);
                          setTextPositionX(p.left);
                          setTextPositionY(p.top);
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border transition ${
                          textPositionName === pos
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                        }`}
                      >
                        {pos}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[9px] font-mono text-zinc-500">X</label>
                    <input
                      type="number"
                      value={textPositionX}
                      onChange={(e) => setTextPositionX(parseFloat(e.target.value || "0"))}
                      className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-mono text-zinc-500">Y</label>
                    <input
                      type="number"
                      value={textPositionY}
                      onChange={(e) => setTextPositionY(parseFloat(e.target.value || "0"))}
                      className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddText}
                disabled={!textInput.trim()}
                className="w-full py-2.5 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-40 disabled:cursor-not-allowed glow-btn"
              >
                Place Text on Design
              </button>
            </div>
          )}

          {/* Add another text button */}
          {productConfig.elements.filter((e) => e.type === "text").length > 0 && !showTextAddForm && (
            <button
              onClick={() => setShowTextAddForm(true)}
              className="w-full py-2.5 rounded text-xs font-bold border border-dashed border-zinc-600 text-zinc-400 hover:border-blue-500 hover:text-blue-400 transition"
            >
              + Add Another Text
            </button>
          )}

          <div className="h-px bg-zinc-800" />

          {/* Placed Text List */}
          {productConfig.elements.filter((e) => e.type === "text").length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Placed Text</h4>
              {productConfig.elements.map((el, ei) => {
                if (el.type !== "text") return null;
                return el.applications.map((app, ai) => (
                  <PlacedElementCard
                    key={`text-${ei}-${ai}`}
                    elementIndex={ei}
                    appIndex={ai}
                    positionName={app.positionName}
                    elementName={el.name}
                    offsetX={app.offsetX}
                    offsetY={app.offsetY}
                    onOffsetChange={(eIdx, aIdx, x, y) => {
                      setProductConfig((prev) => {
                        const elements = [...prev.elements];
                        const el2 = elements[eIdx];
                        if (el2?.type === "text" && el2.applications[aIdx]) {
                          const apps = [...el2.applications];
                          apps[aIdx] = { ...apps[aIdx], offsetX: x, offsetY: y };
                          elements[eIdx] = { ...el2, applications: apps } as TextElement;
                        }
                        return { ...prev, elements };
                      });
                      const canvas = (engineRef.current as any)?.canvas;
                      if (canvas) {
                        const objs = canvas.getObjects();
                        for (const o of objs) {
                          if ((o as any)._textIndex === eIdx) {
                            o.set({ left: x, top: y });
                            break;
                          }
                        }
                        canvas.renderAll();
                      }
                    }}
                    onRemove={handleRemoveElement}
                  />
                ));
              })}
            </div>
          )}

          <div className="h-px bg-zinc-800" />

          {/* Text Styling Panel */}
          <div className="space-y-4">
            {selectedObjectType === "text" ? (
              <>
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Select & Style</h4>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 font-bold">Font Family</label>
                  <select
                    value={textFont}
                    onChange={(e) => handleTextPropertyChange("fontFamily", e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded border border-zinc-700 bg-zinc-950 text-zinc-300 focus:outline-none focus:border-blue-500"
                  >
                    {FONTS.map((font) => (
                      <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 font-bold">Font Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => handleTextPropertyChange("fill", e.target.value)}
                      className="w-10 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={textColor.toUpperCase()}
                      onChange={(e) => handleTextPropertyChange("fill", e.target.value)}
                      maxLength={7}
                      placeholder="#000000"
                      className="flex-1 px-3 py-1.5 text-xs font-semibold rounded border border-zinc-700 bg-zinc-950 focus:outline-none focus:border-blue-500 font-mono text-zinc-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-500 font-bold">
                    <span>Font Size</span>
                    <span>{textSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={80}
                    value={textSize}
                    onChange={(e) => handleTextPropertyChange("fontSize", parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleTextPropertyChange("fontWeight", isBold ? "normal" : "bold")}
                    className={`py-2 rounded text-xs font-extrabold border transition ${
                      isBold ? "bg-zinc-800 border-blue-500 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    B
                  </button>
                  <button
                    onClick={() => handleTextPropertyChange("fontStyle", isItalic ? "normal" : "italic")}
                    className={`py-2 rounded text-xs italic font-bold border transition ${
                      isItalic ? "bg-zinc-800 border-blue-500 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    I
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </div>
  );
}
