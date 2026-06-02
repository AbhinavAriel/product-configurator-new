"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ConfiguratorEngine } from "@configurator/core";
import TshirtPreview from "@/components/JerseyPreview";

// Curated Premium Color Palettes
const PRESET_PALETTES = [
  {
    name: "Classic Sleek",
    colors: [
      { name: "White Silk", hex: "#ffffff" },
      { name: "Stealth Black", hex: "#18181b" },
      { name: "Crimson Spark", hex: "#dc2626" },
      { name: "Cobalt Depth", hex: "#2563eb" },
      { name: "Sage Forest", hex: "#16a34a" },
      { name: "Blush Satin", hex: "#db2777" },
    ],
  },
  {
    name: "Modern Pastels",
    colors: [
      { name: "Lilac Haze", hex: "#e9d5ff" },
      { name: "Mint Breeze", hex: "#d1fae5" },
      { name: "Peach Butter", hex: "#ffedd5" },
      { name: "Sky Glaze", hex: "#bae6fd" },
      { name: "Mellow Lemon", hex: "#fef9c3" },
      { name: "Coral Cream", hex: "#fecaca" },
    ],
  },
  {
    name: "Luxury Metallic",
    colors: [
      { name: "Champagne Gold", hex: "#fef08a" },
      { name: "Titanium Silver", hex: "#cbd5e1" },
      { name: "Space Graphite", hex: "#4b5563" },
      { name: "Rose Copper", hex: "#fed7aa" },
    ],
  },
];
const PRODUCT_IMAGES = {
  back: "/images/phone-case-back.jpg",
  front: "/images/phone-case-front.jfif",
  side: "/images/phone-case-side.webp",
};



// Curated Offline SVG Stickers (High Resolution, Scalable vectors encoded as inline Data URLs)
const STICKERS = [
  {
    name: "Smile Badge",
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" fill="%23facc15"/><circle cx="35" cy="40" r="5" fill="%23000"/><circle cx="65" cy="40" r="5" fill="%23000"/><path d="M30 60 Q50 80 70 60" stroke="%23000" stroke-width="5" stroke-linecap="round" fill="none"/></svg>',
  },
  {
    name: "Love Heart",
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><path d="M12 35 C12 20 27 10 50 30 C73 10 88 20 88 35 C88 58 50 85 50 85 C50 85 12 58 12 35 Z" fill="%23ef4444" stroke="%23b91c1c" stroke-width="2"/></svg>',
  },
  {
    name: "Lightning Bolt",
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><path d="M60 10 L25 55 L50 55 L40 90 L75 45 L50 45 Z" fill="%23eab308" stroke="%23ca8a04" stroke-width="2"/></svg>',
  },
  {
    name: "Retro Cosmic Star",
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><path d="M50 5 L63 35 L95 38 L70 60 L78 92 L50 75 L22 92 L30 60 L5 38 L37 35 Z" fill="%23818cf8" stroke="%234f46e5" stroke-width="2"/></svg>',
  },
  {
    name: "Ocean Wave",
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" fill="%230ea5e9"/><path d="M20 60 C35 50 45 70 60 60 C75 50 85 70 90 60 L90 95 L10 95 Z" fill="%2338bdf8"/></svg>',
  },
  {
    name: "Cyber Punk Skull",
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect x="30" y="30" width="40" height="45" rx="15" fill="%23a1a1aa"/><rect x="38" y="70" width="24" height="15" fill="%23a1a1aa"/><circle cx="42" cy="48" r="8" fill="%2318181b"/><circle cx="58" cy="48" r="8" fill="%2318181b"/><path d="M48 62 L52 62" stroke="%2318181b" stroke-width="4"/><path d="M42 75 L42 80 M50 75 L50 80 M58 75 L58 80" stroke="%2318181b" stroke-width="2"/></svg>',
  },
];

// Available Fonts
const FONTS = [
  { name: "Outfit (Modern)", value: "Outfit" },
  { name: "Pacifico (Script)", value: "Pacifico" },
  { name: "Montserrat (Chic)", value: "Montserrat" },
  { name: "Playfair Display (Classy)", value: "Playfair Display" },
  { name: "Cinzel (Classic)", value: "Cinzel" },
  { name: "Bungee (Retro)", value: "Bungee" },
  { name: "Lobster (Bold Script)", value: "Lobster" },
  { name: "Permanent Marker", value: "Permanent Marker" },
];

const STEPS = ["Color", "Text", "Stickers", "Review"] as const;

export default function Home() {
  const engineRef = useRef<ConfiguratorEngine | null>(null);
  const [activeView, setActiveView] = useState<"back" | "front" | "side">("back");
  const [caseColor, setCaseColor] = useState("#ffffff");
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [bodyColor, setBodyColor] = useState("#FFFFFF");

  const [sleeveColor, setSleeveColor] = useState("#FFFFFF");

  const [collarColor, setCollarColor] = useState("#FFFFFF");

  const [stripeColor, setStripeColor] = useState("#FFFFFF");

  // Custom text options
  const [textInput, setTextInput] = useState("");
  const [textFont, setTextFont] = useState("Outfit");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(32);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlignment, setTextAlignment] = useState<"left" | "center" | "right">("center");

  // Layers list tracking
  const [canvasLayers, setCanvasLayers] = useState<any[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // File Upload References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Cover background image state
  const [hasCoverImage, setHasCoverImage] = useState(false);

  // 360-degree rotation animation state
  const [isRotating, setIsRotating] = useState(false);

  // Synchronize layers from the engine canvas
  const updateLayersList = useCallback(() => {
    const eng = engineRef.current;
    if (!eng) return;
    const canvas = (eng as any).canvas;
    if (!canvas) return;

    const objects = canvas.getObjects();
    const customizable = objects.filter(
      (obj: any) => obj.selectable && obj.type !== "rect"
    );

    const mappedLayers = customizable.map((obj: any, idx: number) => ({
      id: obj.id || `layer-${idx}-${Date.now()}`,
      type: obj.type === "textbox" ? "Text" : "Sticker/Image",
      text: obj.text || `Sticker ${idx + 1}`,
      rawObject: obj,
    }));

    setCanvasLayers(mappedLayers);

    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      const match = mappedLayers.find((l: any) => l.rawObject === activeObj);
      setSelectedLayerId(match ? match.id : null);
    } else {
      setSelectedLayerId(null);
    }
  }, []);

  const handleEngineReady = useCallback(
    (eng: ConfiguratorEngine) => {
      engineRef.current = eng;

      const canvas = (eng as any).canvas;
      if (canvas) {
        const events = ["object:added", "object:removed", "object:modified", "selection:created", "selection:updated", "selection:cleared"];
        events.forEach((evt) => {
          canvas.on(evt, updateLayersList);
        });
      }
    },
    [updateLayersList]
  );

  // Clean up events on unmount
  useEffect(() => {
    return () => {
      const eng = engineRef.current;
      if (eng) {
        const canvas = (eng as any).canvas;
        if (canvas) {
          canvas.off();
        }
      }
    };
  }, []);

  // Color change handler
  const handleColorChange = (colorHex: string) => {
    setCaseColor(colorHex);
  };

  // Text additions
  const handleAddText = () => {
    if (!textInput.trim()) return;
    engineRef.current?.addText(textInput, {
      fontFamily: textFont,
      fontSize: textSize,
      fill: textColor,
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      textAlign: textAlignment,
    });
    setTextInput("");
  };

  // Live text styling modifications
  const handleTextPropertyChange = (property: string, value: any) => {
    if (!engineRef.current) return;

    if (property === "fontFamily") setTextFont(value);
    if (property === "fill") setTextColor(value);
    if (property === "fontSize") setTextSize(value);
    if (property === "fontWeight") setIsBold(value === "bold");
    if (property === "fontStyle") setIsItalic(value === "italic");
    if (property === "textAlign") setTextAlignment(value);

    engineRef.current.updateSelectedText({ [property]: value });
  };

  // Sticker additions
  const handleAddSticker = (url: string) => {
    engineRef.current?.addSticker(url);
  };

  // User uploaded image as sticker
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        engineRef.current?.addImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Cover background image upload
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        engineRef.current?.setBackgroundImage(event.target.result as string);
        setHasCoverImage(true);
      }
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file triggers change
    e.target.value = "";
  };

  const handleRemoveCoverImage = () => {
    engineRef.current?.removeBackgroundImage();
    setHasCoverImage(false);
  };

  // Layer deletion/ordering
  const selectLayer = (layer: any) => {
    const eng = engineRef.current;
    if (!eng) return;
    const canvas = (eng as any).canvas;
    if (canvas) {
      canvas.setActiveObject(layer.rawObject);
      canvas.renderAll();
      setSelectedLayerId(layer.id);
    }
  };

  const handleExport = () => {
    const dataUrl = engineRef.current?.exportDesign();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = `custom-phone-case-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Simulate 360 rotation by auto toggling active angle views
  const handle360Rotate = () => {
    if (isRotating) return;
    setIsRotating(true);
    let current = 0;
    const views: Array<"back" | "front" | "side"> = ["back", "side", "front", "side", "back"];
    const interval = setInterval(() => {
      current += 1;
      if (current < views.length) {
        setActiveView(views[current]);
      } else {
        clearInterval(interval);
        setIsRotating(false);
      }
    }, 1200);
  };

  return (
    <main className="flex-1 flex flex-col md:flex-row h-screen overflow-hidden bg-zinc-950 text-zinc-100">

      {/* 1. LEFT WORKSPACE PANEL: Large mockups & Canvas view */}
      <section className="flex-1 relative flex flex-col items-center justify-between p-6 md:p-8 checkerboard-grid border-b md:border-b-0 md:border-r border-zinc-800">

        {/* Dynamic Premium Header */}
        <div className="w-full flex items-center justify-between z-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold font-mono">Custom Studio</span>
            <h1 className="text-xl md:text-2xl font-black text-white">IMPACT COVER PRO</h1>
          </div>

          {/* Action Tools */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear your custom design?")) {
                  const eng = engineRef.current;
                  const canvas = (eng as any)?.canvas;
                  if (canvas) {
                    const objs = canvas.getObjects().filter((o: any) => o.selectable && o.type !== "rect");
                    objs.forEach((o: any) => canvas.remove(o));
                    canvas.renderAll();
                    updateLayersList();
                  }
                }
              }}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 transition glow-btn"
            >
              Clear Canvas
            </button>

            <button
              onClick={handleExport}
              className="px-5 py-2 text-xs font-bold rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg glow-btn"
            >
              Export Print PNG
            </button>
          </div>
        </div>

        {/* Center Viewer Area */}
        <div className="relative">
          <TshirtPreview
            bodyColor={bodyColor}
            sleeveColor={sleeveColor}
            collarColor={collarColor}
            stripeColor={stripeColor}
          />

          {/* <div
            className="absolute inset-0"
            style={{
              backgroundColor: caseColor,
              mixBlendMode: "multiply",
              maskImage: `url(${PRODUCT_IMAGES[activeView]})`,
              WebkitMaskImage: `url(${PRODUCT_IMAGES[activeView]})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          /> */}
        </div>

        {/* Floating View Switcher & Showcase controls */}
        <div className="flex items-center gap-6 z-10 bg-zinc-900/70 border border-zinc-800 p-2.5 rounded-full backdrop-blur-md shadow-2xl">
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveView("back")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${activeView === "back"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
                }`}
            >
              Back Case
            </button>
            <button
              onClick={() => setActiveView("side")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${activeView === "side"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
                }`}
            >
              Side View
            </button>
            <button
              onClick={() => setActiveView("front")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${activeView === "front"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
                }`}
            >
              Front Glass
            </button>
          </div>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* 360° Rotate Button */}
          <button
            onClick={handle360Rotate}
            disabled={isRotating}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 transition glow-btn ${isRotating ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <svg
              className={`w-3.5 h-3.5 text-indigo-400 ${isRotating ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
            </svg>
            {isRotating ? "Rotating..." : "360° View"}
          </button>
        </div>

      </section>

      {/* 2. RIGHT CONFIGURATOR CONTROL PANEL: Step-by-step wizard */}
      <section className="w-full md:w-[420px] flex flex-col bg-zinc-900 border-l border-zinc-800">

        {/* Step progress indicator */}
        <div className="flex items-center gap-0 px-6 pt-5 pb-3 bg-zinc-950/50 border-b border-zinc-800">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-center w-full">
                <div className={`h-0.5 flex-1 ${idx === 0 ? "invisible" : idx <= currentStep ? "bg-indigo-500" : "bg-zinc-800"}`} />
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${idx < currentStep
                  ? "bg-indigo-600 text-white"
                  : idx === currentStep
                    ? "bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400"
                    : "bg-zinc-900 border border-zinc-700 text-zinc-500"
                  }`}>
                  {idx < currentStep ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className={`h-0.5 flex-1 ${idx === STEPS.length - 1 ? "invisible" : idx < currentStep ? "bg-indigo-500" : "bg-zinc-800"}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${idx === currentStep ? "text-indigo-400" : "text-zinc-500"
                }`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step content panel */}
        <div className="flex-1 p-6 overflow-y-auto">

          {/* STEP 0: Color */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">Choose a Color</h3>
                <p className="text-xs text-zinc-500">Pick a background color for the phone case</p>
              </div>

              {/* {PRESET_PALETTES.map((palette) => (
                <div key={palette.name} className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">{palette.name}</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {palette.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color.hex)}
                        title={color.name}
                        style={{ backgroundColor: color.hex }}
                        className={`w-full aspect-square rounded-full transition-all duration-300 relative border ${caseColor.toLowerCase() === color.hex.toLowerCase()
                          ? "ring-2 ring-indigo-500 scale-110 shadow-md border-white/60"
                          : "border-zinc-800 "
                          }`}
                      >
                        {caseColor.toLowerCase() === color.hex.toLowerCase() && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow border border-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))} */}
              <div className="space-y-4">

                <div>
                  <label>Body Color</label>
                  <input
                    type="color"
                    value={bodyColor}
                    onChange={(e) =>
                      setBodyColor(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label>Sleeve Color</label>
                  <input
                    type="color"
                    value={sleeveColor}
                    onChange={(e) =>
                      setSleeveColor(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label>Collar Color</label>
                  <input
                    type="color"
                    value={collarColor}
                    onChange={(e) =>
                      setCollarColor(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label>Stripe Color</label>
                  <input
                    type="color"
                    value={stripeColor}
                    onChange={(e) =>
                      setStripeColor(e.target.value)
                    }
                  />
                </div>

              </div>

              <div className="h-[1px] bg-zinc-800" />

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Custom Color</h4>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={caseColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-10 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={caseColor.toUpperCase()}
                    onChange={(e) => handleColorChange(e.target.value)}
                    maxLength={7}
                    placeholder="#FFFFFF"
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded border border-zinc-700 bg-zinc-950 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="h-[1px] bg-zinc-800" />

              {/* Cover background image upload */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Cover Image (Optional)</h4>
                <p className="text-xs text-zinc-500">Upload a blank cover template as the base</p>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition"
                >
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-bold text-indigo-400">Click to upload</span>
                </div>
                {hasCoverImage && (
                  <button onClick={handleRemoveCoverImage} className="w-full py-2 rounded text-xs font-bold border border-red-900 bg-red-950/20 text-red-400 hover:bg-red-950/40 transition">
                    Remove Cover Image
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 1: Text */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">Add Text</h3>
                <p className="text-xs text-zinc-500 font-medium">Type custom words and style them</p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type custom text..."
                  className="w-full px-4 py-3 text-sm font-medium rounded border border-zinc-700 bg-zinc-950 focus:outline-none focus:border-indigo-500 text-white placeholder-zinc-500"
                />
                <button
                  onClick={handleAddText}
                  disabled={!textInput.trim()}
                  className="w-full py-2.5 rounded text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-40 disabled:cursor-not-allowed glow-btn"
                >
                  Place Text on Case
                </button>
              </div>

              <div className="h-[1px] bg-zinc-800" />

              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Select & Style</h4>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 font-bold">Font Family</label>
                  <select
                    value={textFont}
                    onChange={(e) => handleTextPropertyChange("fontFamily", e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded border border-zinc-700 bg-zinc-950 text-zinc-300 focus:outline-none focus:border-indigo-500"
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
                      className="flex-1 px-3 py-1.5 text-xs font-semibold rounded border border-zinc-700 bg-zinc-950 focus:outline-none focus:border-indigo-500 font-mono text-zinc-200"
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
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleTextPropertyChange("fontWeight", isBold ? "normal" : "bold")}
                    className={`py-2 rounded text-xs font-extrabold border transition ${isBold ? "bg-zinc-800 border-indigo-500 text-indigo-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      }`}
                  >B</button>
                  <button
                    onClick={() => handleTextPropertyChange("fontStyle", isItalic ? "normal" : "italic")}
                    className={`py-2 rounded text-xs italic font-bold border transition ${isItalic ? "bg-zinc-800 border-indigo-500 text-indigo-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      }`}
                  >I</button>
                  <div className="flex border border-zinc-700 rounded overflow-hidden">
                    <button onClick={() => handleTextPropertyChange("textAlign", "left")}
                      className={`flex-1 py-2 text-[10px] font-bold transition ${textAlignment === "left" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-800"}`}>L</button>
                    <button onClick={() => handleTextPropertyChange("textAlign", "center")}
                      className={`flex-1 py-2 text-[10px] font-bold transition ${textAlignment === "center" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-800"}`}>C</button>
                    <button onClick={() => handleTextPropertyChange("textAlign", "right")}
                      className={`flex-1 py-2 text-[10px] font-bold transition ${textAlignment === "right" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-800"}`}>R</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Stickers & Upload */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">Stickers & Uploads</h3>
                <p className="text-xs text-zinc-500">Add decals or your own images</p>
              </div>

              {/* Stickers grid */}
              <div className="grid grid-cols-3 gap-3">
                {STICKERS.map((sticker) => (
                  <button
                    key={sticker.name}
                    onClick={() => handleAddSticker(sticker.url)}
                    className="aspect-square flex items-center justify-center p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-indigo-500 hover:bg-zinc-900 transition-all duration-300 relative group overflow-hidden"
                  >
                    <img src={sticker.url} alt={sticker.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-300" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[8px] font-mono text-center text-zinc-400 opacity-0 group-hover:opacity-100 transition">Add</div>
                  </button>
                ))}
              </div>

              <div className="h-[1px] bg-zinc-800" />

              {/* Upload custom image */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-2">Upload Your Image</h4>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition"
                >
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-xs font-bold text-indigo-400">Upload PNG, JPG</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Export */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">Review Your Design</h3>
                <p className="text-xs text-zinc-500">Manage layers and export your creation</p>
              </div>

              {/* Layers summary */}
              {canvasLayers.length === 0 ? (
                <div className="text-center py-8 border border-zinc-800 border-dashed rounded-xl bg-zinc-950/40">
                  <span className="text-xs text-zinc-500 block">No custom items added yet</span>
                  <span className="text-[10px] text-zinc-600">Go back and add text or stickers!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono font-bold text-zinc-500 uppercase">Layers ({canvasLayers.length})</h4>
                  <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                    {canvasLayers.map((layer) => (
                      <div
                        key={layer.id}
                        onClick={() => selectLayer(layer)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition cursor-pointer ${selectedLayerId === layer.id
                          ? "bg-zinc-800 border-indigo-500 text-indigo-300"
                          : "bg-zinc-950 border-zinc-800 hover:bg-zinc-900/60 text-zinc-400"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold font-mono bg-zinc-900 border border-zinc-700 text-zinc-400">{layer.type}</span>
                          <span className="text-xs font-semibold max-w-[150px] truncate">{layer.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button onClick={() => { engineRef.current?.bringToFront(); updateLayersList(); }} disabled={!selectedLayerId}
                      className="py-2 rounded text-[11px] font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition">Bring to Front</button>
                    <button onClick={() => { engineRef.current?.sendToBack(); updateLayersList(); }} disabled={!selectedLayerId}
                      className="py-2 rounded text-[11px] font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition">Send to Back</button>
                    <button onClick={() => { engineRef.current?.duplicateSelected(); updateLayersList(); }} disabled={!selectedLayerId}
                      className="py-2 rounded text-[11px] font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition">Duplicate</button>
                    <button onClick={() => { engineRef.current?.deleteSelected(); updateLayersList(); }} disabled={!selectedLayerId}
                      className="py-2 rounded text-[11px] font-bold border border-red-950 bg-red-950/20 text-red-400 hover:bg-red-950/40 disabled:opacity-40 disabled:cursor-not-allowed transition">Delete</button>
                  </div>
                </div>
              )}

              <div className="h-[1px] bg-zinc-800" />

              {/* Export */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Export</h4>
                <button onClick={handleExport} className="w-full py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg glow-btn flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download High-Res PNG
                </button>
                <p className="text-[10px] text-zinc-500 text-center">2x resolution print-ready export</p>
              </div>
            </div>
          )}

        </div>

        {/* Step navigation footer */}
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
              <span className="text-[10px] text-zinc-600 font-mono">iPhone 11 Pro Max</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-6 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition glow-btn"
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

    </main>
  );
}