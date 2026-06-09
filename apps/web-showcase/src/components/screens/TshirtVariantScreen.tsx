"use client";

import type { TshirtVariant } from "@/components/JerseyPreview";

interface TshirtVariantScreenProps {
  onBack: () => void;
  onSelectVariant: (variant: TshirtVariant) => void;
}

export default function TshirtVariantScreen({
  onBack,
  onSelectVariant,
}: TshirtVariantScreenProps) {
  return (
    <main className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl w-full px-6">
        <button
          onClick={onBack}
          className="mb-8 text-zinc-500 hover:text-zinc-300 transition flex items-center gap-2 text-sm font-semibold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </button>

        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold font-mono">
            T-Shirt / Jersey
          </span>
          <h1 className="text-4xl font-black text-white mt-3 mb-3">Choose Sleeve Style</h1>
          <p className="text-zinc-400 text-sm">Select the jersey structure before customizing layers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onSelectVariant("full-sleeves")}
            className="group relative bg-zinc-900 border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="relative h-48 mb-5 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
              <img
                src="/products/tshirt/01---Body.png"
                alt="Full sleeve jersey"
                className="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Full Sleeves</h2>
          </button>

          <button
            onClick={() => onSelectVariant("half-sleeves")}
            className="group relative bg-zinc-900 border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="relative h-48 mb-5 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
              <img
                src="/products/tshirt/half-sleeves/01---Body.png"
                alt="Half sleeve jersey"
                className="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Half Sleeves</h2>
          </button>

          <button
            onClick={() => onSelectVariant("sleevless")}
            className="group relative bg-zinc-900 border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="relative h-48 mb-5 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
              <img
                src="/products/tshirt/sleevless/01-Body.png"
                alt="Sleeveless jersey"
                className="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Sleeveless</h2>
          </button>
        </div>
      </div>
    </main>
  );
}
