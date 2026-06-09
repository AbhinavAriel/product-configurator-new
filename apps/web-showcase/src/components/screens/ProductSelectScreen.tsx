"use client";

import type { ProductType } from "@configurator/core";

interface ProductSelectScreenProps {
  onSelectTshirt: () => void;
  onSelectBag: () => void;
  onSelectMobileCase: () => void;
  onSelectShorts: () => void;
}

export default function ProductSelectScreen({
  onSelectTshirt,
  onSelectBag,
  onSelectMobileCase,
  onSelectShorts,
}: ProductSelectScreenProps) {
  return (
    <main className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl w-full px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold font-mono">
            Custom Studio
          </span>
          <h1 className="text-4xl font-black text-white mt-3 mb-3">Choose Your Product</h1>
          <p className="text-zinc-400 text-sm">Select a product to start customizing</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <button
            onClick={onSelectTshirt}
            className="group relative bg-zinc-900 cursor-pointer border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M320.2 176C364.4 176 400.2 140.2 400.2 96L453.7 96C470.7 96 487 102.7 499 114.7L617.6 233.4C630.1 245.9 630.1 266.2 617.6 278.7L566.9 329.4C554.4 341.9 534.1 341.9 521.6 329.4L480.2 288L480.2 512C480.2 547.3 451.5 576 416.2 576L224.2 576C188.9 576 160.2 547.3 160.2 512L160.2 288L118.8 329.4C106.3 341.9 86 341.9 73.5 329.4L22.9 278.6C10.4 266.1 10.4 245.8 22.9 233.3L141.5 114.7C153.5 102.7 169.8 96 186.8 96L240.3 96C240.3 140.2 276.1 176 320.3 176z" fill="#3379ff" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">T-Shirt / Jersey</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Customize your jersey with layer colors, text, stickers, and logos
            </p>
          </button>

          <button
            onClick={onSelectBag}
            className="group relative bg-zinc-900 cursor-pointer border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M192 96C192 42.98 234.1 0 288 0H352C405 0 448 42.98 448 96V128H480C524.8 128 564.1 159.5 577.5 202.5L625.5 362.5C633.8 389.1 638 416.9 638 445.1C638 531.2 567.2 602 481.1 602H158.9C72.8 602 2 531.2 2 445.1C2 416.9 6.2 389.1 14.5 362.5L62.5 202.5C75.9 159.5 115.2 128 160 128H192V96zM256 96V128H384V96C384 78.33 369.7 64 352 64H288C270.3 64 256 78.33 256 96zM160 192C142.3 192 128 206.3 128 224C128 241.7 142.3 256 160 256C177.7 256 192 241.7 192 224C192 206.3 177.7 192 160 192zM480 192C462.3 192 448 206.3 448 224C448 241.7 462.3 256 480 256C497.7 256 512 241.7 512 224C512 206.3 497.7 192 480 192z" fill="#3379ff" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Bag</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Customize your bag with layer colors, text, and logos
            </p>
          </button>

          <button
            onClick={onSelectMobileCase}
            className="group relative bg-zinc-900 cursor-pointer border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M208 64C172.7 64 144 92.7 144 128L144 512C144 547.3 172.7 576 208 576L432 576C467.3 576 496 547.3 496 512L496 128C496 92.7 467.3 64 432 64L208 64zM280 480L360 480C373.3 480 384 490.7 384 504C384 517.3 373.3 528 360 528L280 528C266.7 528 256 517.3 256 504C256 490.7 266.7 480 280 480z" fill="#3379ff" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Mobile Case</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Design your phone case with colors, text, and stickers
            </p>
          </button>

          <button
            onClick={onSelectShorts}
            className="group relative bg-zinc-900 cursor-pointer border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M128 64C92.7 64 64 92.7 64 128V288L192 288V192H448V288L576 288V128C576 92.7 547.3 64 512 64H128zM192 352L64 352V512C64 547.3 92.7 576 128 576H256L256 352H192zM384 352V576H512C547.3 576 576 547.3 576 512V352L448 352V416C448 433.7 433.7 448 416 448C398.3 448 384 433.7 384 416V352z" fill="#3379ff" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Shorts</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Design custom shorts with colors, logos, and graphics
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}
