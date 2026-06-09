"use client";

import type { ProductType } from "@configurator/core";

interface ControlPanelProps {
  selectedProduct: ProductType;
  productName: string;
  visibleSteps: readonly string[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  canProceedToNextStep: boolean;
  children: React.ReactNode;
}

export default function ControlPanel({
  selectedProduct,
  productName,
  visibleSteps,
  currentStep,
  setCurrentStep,
  canProceedToNextStep,
  children,
}: ControlPanelProps) {
  return (
    <section className="w-full md:w-105 flex flex-col bg-zinc-900 border-l border-zinc-800">
      {/* Progress Indicator */}
      <div className="flex items-center gap-0 px-6 pt-5 pb-3 bg-zinc-950/50 border-b border-zinc-800">
        {visibleSteps.map((label, idx) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-center w-full">
              <div className={`h-0.5 flex-1 ${idx === 0 ? "invisible" : idx <= currentStep ? "bg-blue-500" : "bg-zinc-800"}`} />
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                  idx < currentStep
                    ? "bg-blue-600 text-white"
                    : idx === currentStep
                      ? "bg-blue-500/20 border-2 border-blue-500 text-blue-400"
                      : "bg-zinc-900 border border-zinc-700 text-zinc-500"
                }`}
              >
                {idx < currentStep ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <div
                className={`h-0.5 flex-1 ${
                  idx === visibleSteps.length - 1 ? "invisible" : idx < currentStep ? "bg-blue-500" : "bg-zinc-800"
                }`}
              />
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                idx === currentStep ? "text-blue-400" : "text-zinc-500"
              }`}
            >
              {label === "Stickers" && selectedProduct === "mobilecase" ? "Add Logo" : label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>

      {/* Navigation */}
      <div className="border-t border-zinc-800 p-4 bg-zinc-950 flex items-center justify-between">
        <div>
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-5 py-2 rounded-lg text-xs font-bold border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
            >
              Back
            </button>
          ) : (
            <span className="text-[10px] text-zinc-600 font-mono">
              {selectedProduct === "mobilecase" ? "iPhone 11 Pro Max" : productName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentStep < visibleSteps.length - 1 ? (
            <button
              onClick={() => {
                if (!canProceedToNextStep) return;
                setCurrentStep((s) => s + 1);
              }}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                !canProceedToNextStep ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white glow-btn"
              }`}
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(0)}
              className="px-5 py-2 rounded-lg text-xs font-bold border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
