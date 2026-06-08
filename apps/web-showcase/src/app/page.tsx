"use client";

import NextImage from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { ConfiguratorEngine } from "@configurator/core";
import type { ProductConfig, ProductType, MaterialLayer, LogoElement, LogoApplication, TextElement, TextApplication, ProductElement } from "@configurator/core";
import { DEFAULT_TSHIRT_CONFIG, DEFAULT_HALF_SLEEVE_TSHIRT_CONFIG, DEFAULT_SLEEVELESS_TSHIRT_CONFIG, DEFAULT_BAG_CONFIG, DEFAULT_MOBILECASE_CONFIG } from "@configurator/core";
import TshirtPreview, { TSHIRT_LAYER_PRESETS, type TshirtVariant } from "@/components/JerseyPreview";
import BagPreview, { BAG_LAYER_PRESETS } from "@/components/BagPreview";
import MobileCasePreview from "@/components/MobileCasePreview";
import ConfiguratorViewer from "@/components/ConfiguratorViewer";

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

const ALL_STEPS = ["Color", "Text", "Logo", "Stickers", "Review"] as const;

function getVisibleSteps(productType: ProductType): readonly string[] {
  if (productType === "tshirt" || productType === "bag") return ALL_STEPS.filter((s) => s !== "Stickers");
  return ALL_STEPS.filter((s) => s !== "Logo");
}

const DUMMY_LOGO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" fill="none"><rect width="200" height="100" rx="12" fill="%236366f1"/><rect x="8" y="8" width="184" height="84" rx="6" stroke="%23c7d2fe" stroke-width="2" fill="none"/><text x="100" y="58" text-anchor="middle" fill="white" font-size="32" font-weight="900" font-family="Arial">LOGO</text></svg>';

const LOGO_POSITIONS = [
  "Left Breast",
  "Right Breast",
  "Center Chest",
  "Reverse",
  // "Left Sleeve",
  // "Right Sleeve",
];

const LOGO_POSITION_COORDS: Record<string, { left: number; top: number }> = {
  "Left Breast": { left: 222, top: 130 },
  "Right Breast": { left: 117, top: 145 },
  "Center Chest": { left: 165, top: 145 },
  "Reverse": { left: 475, top: 123 },
  "Left Sleeve": { left: 45, top: 170 },
  "Right Sleeve": { left: 286, top: 187 },
};

const TEXT_POSITIONS: Record<string, { left: number; top: number }> = {
  "Center": { left: 325, top: 250 },
  "Top Center": { left: 325, top: 120 },
  "Bottom Center": { left: 325, top: 380 },
  "Left Chest": { left: 200, top: 220 },
  "Right Chest": { left: 450, top: 220 },
};

const MOBILECASE_TEXT_POSITIONS: Record<string, { left: number; top: number }> = {
  "Center": { left: 160, top: 275 },
  "Top": { left: 160, top: 120 },
  "Bottom": { left: 160, top: 420 },
};

export default function Home() {
  const engineRef = useRef<ConfiguratorEngine | null>(null);
  const [screen, setScreen] = useState<"select" | "tshirtVariant" | "configurator">("select");
  const [activeView, setActiveView] = useState<"back" | "front">("back");
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [productConfig, setProductConfig] = useState<ProductConfig>(DEFAULT_TSHIRT_CONFIG);

  const selectedProduct = productConfig.product.productType;

  const [textInput, setTextInput] = useState("");
  const [textFont, setTextFont] = useState("Outfit");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(26);
  const [isBold, setIsBold] = useState(false);
  const [logoWidth, setLogoWidth] = useState(60);
  const [logoHeight, setLogoHeight] = useState(50);
  const [logoPosition, setLogoPosition] = useState("Left Breast");
  const [isItalic, setIsItalic] = useState(false);
  const [textStepEnabled, setTextStepEnabled] = useState<boolean | null>(null);
  const [stickerStepEnabled, setStickerStepEnabled] = useState<boolean | null>(null);
  const [logoStepEnabled, setLogoStepEnabled] = useState<boolean | null>(null);
  const [selectedObjectType, setSelectedObjectType] = useState<string | null>(null);
  const [selectedImageWidth, setSelectedImageWidth] = useState(0);
  const [selectedImageHeight, setSelectedImageHeight] = useState(0);
  const [textAlignment, setTextAlignment] = useState<"left" | "center" | "right">("center");
  const [textPositionPreset, setTextPositionPreset] = useState("Center");
  const [textPositionName, setTextPositionName] = useState("Center Chest");
  const [textPositionX, setTextPositionX] = useState(165);
  const [textPositionY, setTextPositionY] = useState(145);

  const [mobileLogoWidth, setMobileLogoWidth] = useState(100);
  const [mobileLogoHeight, setMobileLogoHeight] = useState(100);
  const [mobileLogoPositionName, setMobileLogoPositionName] = useState("Center");

  const [showTextAddForm, setShowTextAddForm] = useState(false);
  const [showLogoAddForm, setShowLogoAddForm] = useState(false);
  const [showMobileLogoAddForm, setShowMobileLogoAddForm] = useState(false);

  const [canvasLayers, setCanvasLayers] = useState<any[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const [hasCoverImage, setHasCoverImage] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const getTshirtVariant = (config: ProductConfig = productConfig): TshirtVariant =>
    config.product.productType === "tshirt" && config.product.sleeveLength === "Half Sleeve"
      ? "half-sleeves"
      : config.product.sleeveLength === "Sleeveless"
        ? "sleevless"
        : "full-sleeves";

  const handleSelectProduct = (type: ProductType, tshirtVariant: TshirtVariant = "full-sleeves") => {
    const config = type === "tshirt"
      ? tshirtVariant === "half-sleeves"
        ? DEFAULT_HALF_SLEEVE_TSHIRT_CONFIG
        : tshirtVariant === "sleevless"
          ? DEFAULT_SLEEVELESS_TSHIRT_CONFIG
          : DEFAULT_TSHIRT_CONFIG
      : type === "bag"
        ? DEFAULT_BAG_CONFIG
        : DEFAULT_MOBILECASE_CONFIG;
    setProductConfig(JSON.parse(JSON.stringify(config)));
    setCurrentStep(0);
    setScreen("configurator");
    setTextStepEnabled(null);
    setStickerStepEnabled(null);
    setLogoStepEnabled(null);
    setSelectedObjectType(null);
    if (type === "mobilecase") {
      setTextPositionName("Center");
      setTextPositionX(160);
      setTextPositionY(275);
    } else {
      setTextPositionName("Center Chest");
      setTextPositionX(165);
      setTextPositionY(145);
    }
  };

  const tshirtVariant = getTshirtVariant();

  const handleBackToHome = () => {
    setScreen("select");
    setTextStepEnabled(null);
    setStickerStepEnabled(null);
    setLogoStepEnabled(null);
  };

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
        const events = ["object:added", "object:removed", "object:modified"];
        events.forEach((evt) => {
          canvas.on(evt, updateLayersList);
        });

        const syncTextProperties = (obj: any) => {
          if (!obj) return;
          setSelectedObjectType(obj.type === "textbox" ? "text" : "image");
          if (obj.type === "textbox") {
            setTextFont(obj.fontFamily || "Outfit");
            setTextColor(obj.fill || "#000000");
            setTextSize(obj.fontSize || 32);
            setIsBold(obj.fontWeight === "bold");
            setIsItalic(obj.fontStyle === "italic");
            setTextAlignment(obj.textAlign || "center");
            setTextPositionX(obj.left || 0);
            setTextPositionY(obj.top || 0);
          } else {
            setSelectedImageWidth(Math.round((obj.width * obj.scaleX) * 100) / 100);
            setSelectedImageHeight(Math.round((obj.height * obj.scaleY) * 100) / 100);
          }
        };

        canvas.on("selection:created", (e: any) => {
          updateLayersList();
          syncTextProperties(e.selected?.[0] || e.target || null);
        });

        canvas.on("selection:updated", (e: any) => {
          updateLayersList();
          syncTextProperties(e.selected?.[0] || e.target || null);
        });

        canvas.on("selection:cleared", () => {
          updateLayersList();
          setSelectedObjectType(null);
        });

        canvas.on("mouse:down", (e: any) => {
          if (e.target) {
            syncTextProperties(e.target);
          }
        });

        canvas.on("object:modified", () => {
          const obj = canvas.getActiveObject();
          if (obj) {
            syncTextProperties(obj);
            const logoIndex = (obj as any)._logoIndex;
            if (logoIndex !== undefined) {
              setProductConfig((prev) => {
                const elements = [...prev.elements];
                const el = elements[logoIndex];
                if (el?.type === "logo" && el.applications[0]) {
                  const apps = [...el.applications];
                  apps[0] = { ...apps[0], offsetX: Math.round((obj as any).left * 100) / 100, offsetY: Math.round((obj as any).top * 100) / 100 };
                  elements[logoIndex] = { ...el, applications: apps } as LogoElement;
                }
                return { ...prev, elements };
              });
            }
            const textIndex = (obj as any)._textIndex;
            if (textIndex !== undefined) {
              setProductConfig((prev) => {
                const elements = [...prev.elements];
                const el = elements[textIndex];
                if (el?.type === "text" && el.applications[0]) {
                  const apps = [...el.applications];
                  apps[0] = { ...apps[0], offsetX: Math.round((obj as any).left * 100) / 100, offsetY: Math.round((obj as any).top * 100) / 100 };
                  elements[textIndex] = { ...el, applications: apps } as TextElement;
                }
                return { ...prev, elements };
              });
            }
          }
        });
      }

      if (selectedProduct === "tshirt") {
        eng.setClipPath(TSHIRT_LAYER_PRESETS[tshirtVariant].clipPath);
      } else if (selectedProduct === "bag") {
        eng.setClipPath(BAG_LAYER_PRESETS.clipPath);
      } else if (selectedProduct === "mobilecase" && activeView === "back") {
        eng.setClipPath("/products/phone-cover/back-full-color.png");
      }
    },
    [updateLayersList, selectedProduct, activeView, tshirtVariant]
  );

  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;
    if (selectedProduct === "tshirt") {
      eng.setClipPath(TSHIRT_LAYER_PRESETS[tshirtVariant].clipPath);
    } else if (selectedProduct === "bag") {
      eng.setClipPath(BAG_LAYER_PRESETS.clipPath);
    } else if (selectedProduct === "mobilecase") {
      if (activeView === "back") {
        eng.setClipPath("/products/phone-cover/back-full-color.png");
      } else {
        eng.removeClipPath();
      }
    } else {
      eng.removeClipPath();
    }
  }, [selectedProduct, activeView, tshirtVariant]);

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

  const updateMaterialColor = (layerName: string, colourHex: string) => {
    setProductConfig((prev) => ({
      ...prev,
      materials: (prev.materials || []).map((m) =>
        m.layerName === layerName ? { ...m, colourHex } : m
      ),
    }));
  };

  const handleAddText = () => {
    if (!textInput.trim()) return;
    engineRef.current?.addText(textInput, {
      left: textPositionX,
      top: textPositionY,
      fontFamily: textFont,
      fontSize: textSize,
      fill: textColor,
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      textAlign: textAlignment,
    });
    const elementIndex = productConfig.elements.length;
    const textElement: TextElement = {
      name: `${textPositionName} Text`,
      type: "text",
      applications: [
        {
          positionName: textPositionName,
          appType: "Sublimation",
          offsetX: textPositionX,
          offsetY: textPositionY,
        },
      ],
    };
    setProductConfig((prev) => ({
      ...prev,
      elements: [...prev.elements, textElement],
    }));
    const canvas = (engineRef.current as any).canvas;
    if (canvas) {
      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        activeObj._textIndex = elementIndex;
        activeObj._textPosition = textPositionName;
      }
    }
    setTextInput("");
    setShowTextAddForm(false);
  };

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

  const handleAddSticker = (url: string) => {
    engineRef.current?.addSticker(url);
  };

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
  };

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
    e.target.value = "";
  };

  const handleRemoveCoverImage = () => {
    engineRef.current?.removeBackgroundImage();
    setHasCoverImage(false);
  };

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

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const handleExport = async () => {
    const eng = engineRef.current;
    if (!eng) return;

    if (selectedProduct === "tshirt") {
      const W = 650;
      const H = 433;
      const mats = productConfig.materials || [];

      const offscreen = document.createElement("canvas");
      offscreen.width = W;
      offscreen.height = H;
      const ctx = offscreen.getContext("2d")!;

      const preset = TSHIRT_LAYER_PRESETS[tshirtVariant];

      for (const name of preset.order) {
        const src = preset.images[name];
        if (!src) continue;

        const matKey = preset.materialAlias?.[name] || name;
        const mat = mats.find((m) => m.layerName === matKey);
        let color = "";

        if (preset.colorSource?.[name]) {
          const sourceMat = mats.find((m) => m.layerName === preset.colorSource?.[name]);
          if (sourceMat?.colourHex) color = sourceMat.colourHex;
        } else if (mat?.colourHex) {
          color = mat.colourHex;
        }

        const img = await loadImage(src);

        if (color) {
          const temp = document.createElement("canvas");
          temp.width = W;
          temp.height = H;
          const tctx = temp.getContext("2d")!;
          tctx.drawImage(img, 0, 0, W, H);
          tctx.globalCompositeOperation = "source-in";
          tctx.fillStyle = color;
          tctx.fillRect(0, 0, W, H);
          ctx.drawImage(temp, 0, 0);
        } else {
          ctx.drawImage(img, 0, 0, W, H);
        }
      }

      const fabricEl = (eng as any).canvasElement as HTMLCanvasElement;
      ctx.drawImage(fabricEl, 0, 0, W, H);

      const dataUrl = offscreen.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `custom-jersey-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } else if (selectedProduct === "bag") {
      const W = 650;
      const H = 433;
      const mats = productConfig.materials || [];

      const offscreen = document.createElement("canvas");
      offscreen.width = W;
      offscreen.height = H;
      const ctx = offscreen.getContext("2d")!;

      const preset = BAG_LAYER_PRESETS;

      for (const name of preset.order) {
        const src = preset.images[name];
        if (!src) continue;

        const mat = mats.find((m) => m.layerName === name);
        const color = mat?.colourHex || "";

        const img = await loadImage(src);

        if (color) {
          const temp = document.createElement("canvas");
          temp.width = W;
          temp.height = H;
          const tctx = temp.getContext("2d")!;
          tctx.drawImage(img, 0, 0, W, H);
          tctx.globalCompositeOperation = "source-in";
          tctx.fillStyle = color;
          tctx.fillRect(0, 0, W, H);
          ctx.drawImage(temp, 0, 0);
        } else {
          ctx.drawImage(img, 0, 0, W, H);
        }
      }

      const fabricEl = (eng as any).canvasElement as HTMLCanvasElement;
      ctx.drawImage(fabricEl, 0, 0, W, H);

      const dataUrl = offscreen.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `custom-bag-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } else if (selectedProduct === "mobilecase") {
      const W = 485;
      const H = 955;
      const mats = productConfig.materials || [];

      const offscreen = document.createElement("canvas");
      offscreen.width = W;
      offscreen.height = H;
      const ctx = offscreen.getContext("2d")!;

      const activePattern = productConfig.pattern;

      const BACK_LAYERS: { file: string; colorKey?: string; isPattern?: boolean }[] = [
        { file: "back-full-color.png", colorKey: "Back Color" },
        ...(activePattern && activePattern !== "none" ? [{ file: "back-full-color.png", isPattern: true }] : []),
        { file: "back-camera-box.png", colorKey: "Camera Box" },
        { file: "back-camera.png" },
      ];

      const patternColor = productConfig.patternColor || "#000000";
      const toRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
      };

      const getPatternSvg = (p: string) => {
        switch (p) {
          case "lines": return `<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><rect y="0" width="10" height="2" fill="${toRgba(patternColor, 0.3)}"/></svg>`;
          case "dots": return `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="1.5" fill="${toRgba(patternColor, 0.35)}"/></svg>`;
          case "waves": return `<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 10 Q10 0 20 10 Q30 20 40 10" stroke="${toRgba(patternColor, 0.25)}" stroke-width="2" fill="none"/></svg>`;
          default: return "";
        }
      };

      for (const layer of BACK_LAYERS) {
        if (layer.isPattern) {
          const patSvg = getPatternSvg(activePattern || "");
          if (!patSvg) continue;
          const blob = new Blob([patSvg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const patImg = await loadImage(url);
          URL.revokeObjectURL(url);

          const maskImg = await loadImage(`/products/phone-cover/back-full-color.png`);

          const temp = document.createElement("canvas");
          temp.width = W;
          temp.height = H;
          const tctx = temp.getContext("2d")!;

          const patFill = tctx.createPattern(patImg, "repeat")!;
          tctx.fillStyle = patFill;
          tctx.fillRect(0, 0, W, H);

          tctx.globalCompositeOperation = "source-in";
          tctx.drawImage(maskImg, 0, 0, W, H);

          ctx.drawImage(temp, 0, 0);
          continue;
        }

        const img = await loadImage(`/products/phone-cover/${layer.file}`);

        let color = "";
        if (layer.colorKey) {
          const mat = mats.find((m) => m.layerName === layer.colorKey);
          if (mat?.colourHex) color = mat.colourHex;
        }

        if (color) {
          const temp = document.createElement("canvas");
          temp.width = W;
          temp.height = H;
          const tctx = temp.getContext("2d")!;
          tctx.drawImage(img, 0, 0, W, H);
          tctx.globalCompositeOperation = "source-in";
          tctx.fillStyle = color;
          tctx.fillRect(0, 0, W, H);
          ctx.drawImage(temp, 0, 0);
        } else {
          ctx.drawImage(img, 0, 0, W, H);
        }
      }

      const fabricEl = (eng as any).canvasElement as HTMLCanvasElement;
      ctx.drawImage(fabricEl, 0, 0, W, H);

      const dataUrl = offscreen.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `custom-phone-case-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleExportConfig = () => {
    const blob = new Blob([JSON.stringify(productConfig, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.download = `product-config-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleAddLogo = async (logoUrl: string, positionName: string) => {
    if (!engineRef.current) return;
    const coords = LOGO_POSITION_COORDS[positionName] || { left: 325, top: 220 };
    const elementIndex = productConfig.elements.length;
    const logoElement: LogoElement = {
      name: `${positionName} Logo`,
      type: "logo",
      applications: [
        {
          positionName,
          appType: "Sublimation",
          Image: logoUrl,
          ResizedLogo: logoUrl,
          offsetX: coords.left,
          offsetY: coords.top,
          rotationDeg: 0,
        },
      ],
    };
    setProductConfig((prev) => ({
      ...prev,
      elements: [...prev.elements, logoElement],
    }));
    const img = await engineRef.current.addSticker(logoUrl, {
      left: coords.left,
      top: coords.top,
      width: logoWidth,
      height: logoHeight,
    });
    if (img) {
      (img as any)._logoIndex = elementIndex;
      (img as any)._logoPosition = positionName;
    }
    setShowLogoAddForm(false);
  };

  const handleAddMobileLogo = async (logoUrl: string, positionName: string) => {
    if (!engineRef.current) return;
    const coords = MOBILECASE_TEXT_POSITIONS[positionName] || { left: 160, top: 275 };
    const elementIndex = productConfig.elements.length;
    const logoElement: LogoElement = {
      name: `${positionName} Logo`,
      type: "logo",
      applications: [
        {
          positionName,
          appType: "Sublimation",
          Image: logoUrl,
          ResizedLogo: logoUrl,
          offsetX: coords.left,
          offsetY: coords.top,
          rotationDeg: 0,
        },
      ],
    };
    setProductConfig((prev) => ({
      ...prev,
      elements: [...prev.elements, logoElement],
    }));
    const img = await engineRef.current.addSticker(logoUrl, {
      left: coords.left,
      top: coords.top,
      width: mobileLogoWidth,
      height: mobileLogoHeight,
    });
    if (img) {
      (img as any)._logoIndex = elementIndex;
      (img as any)._logoPosition = positionName;
    }
    setShowMobileLogoAddForm(false);
  };

  const handleUpdateLogoOffset = (elementIndex: number, appIndex: number, x: number, y: number) => {
    setProductConfig((prev) => {
      const elements = [...prev.elements];
      const el = elements[elementIndex];
      if (el?.type === "logo" && el.applications[appIndex]) {
        const apps = [...el.applications];
        apps[appIndex] = { ...apps[appIndex], offsetX: x, offsetY: y };
        elements[elementIndex] = { ...el, applications: apps } as LogoElement;
      }
      return { ...prev, elements };
    });
    const eng = engineRef.current;
    if (!eng) return;
    const canvas = (eng as any).canvas;
    if (!canvas) return;
    const objects = canvas.getObjects();
    for (const obj of objects) {
      if ((obj as any)._logoIndex === elementIndex) {
        obj.set({ left: x, top: y });
        break;
      }
    }
    canvas.renderAll();
  };

  const handleRemoveElement = (index: number) => {
    setProductConfig((prev) => ({
      ...prev,
      elements: prev.elements.filter((_, i) => i !== index),
    }));
    const eng = engineRef.current;
    if (!eng) return;
    const canvas = (eng as any).canvas;
    if (!canvas) return;
    const objects = canvas.getObjects();
    for (const obj of objects) {
      if ((obj as any)._logoIndex === index || (obj as any)._textIndex === index) {
        canvas.remove(obj);
        break;
      }
    }
    canvas.renderAll();
    updateLayersList();
  };

  const handleDeleteSelected = () => {
    engineRef.current?.deleteSelected();
    updateLayersList();
  };

  const handleClearAllCanvasItems = () => {
    const eng = engineRef.current;
    const canvas = (eng as any)?.canvas;
    if (canvas) {
      const objs = canvas.getObjects().filter((o: any) => o.selectable && o.type !== "rect");
      objs.forEach((o: any) => canvas.remove(o));
      canvas.renderAll();
      updateLayersList();
    }
  };

  const handle360Rotate = () => {
    if (isRotating) return;
    setIsRotating(true);
    let current = 0;
    const views: Array<"back" | "front"> = ["back", "front", "back"];
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

  const getMaterialColor = (layerName: string): string => {
    return (productConfig.materials || []).find((m) => m.layerName === layerName)?.colourHex || "";
  };

  const visibleSteps = getVisibleSteps(selectedProduct);
  const stepLabel = visibleSteps[currentStep];

  if (screen === "select") {
    return (
      <main className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-3xl w-full px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold font-mono">Custom Studio</span>
            <h1 className="text-4xl font-black text-white mt-3 mb-3">Choose Your Product</h1>
            <p className="text-zinc-400 text-sm">Select a product to start customizing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => setScreen("tshirtVariant")}
              className="group relative bg-zinc-900 cursor-pointer border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-8 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320.2 176C364.4 176 400.2 140.2 400.2 96L453.7 96C470.7 96 487 102.7 499 114.7L617.6 233.4C630.1 245.9 630.1 266.2 617.6 278.7L566.9 329.4C554.4 341.9 534.1 341.9 521.6 329.4L480.2 288L480.2 512C480.2 547.3 451.5 576 416.2 576L224.2 576C188.9 576 160.2 547.3 160.2 512L160.2 288L118.8 329.4C106.3 341.9 86 341.9 73.5 329.4L22.9 278.6C10.4 266.1 10.4 245.8 22.9 233.3L141.5 114.7C153.5 102.7 169.8 96 186.8 96L240.3 96C240.3 140.2 276.1 176 320.3 176z" fill="#3379ff"/></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">T-Shirt / Jersey</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">Customize your jersey with layer colors, text, stickers, and logos</p>
            </button>

            <button onClick={() => handleSelectProduct("bag")}
              className="group relative bg-zinc-900 cursor-pointer border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-8 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M192 96C192 42.98 234.1 0 288 0H352C405 0 448 42.98 448 96V128H480C524.8 128 564.1 159.5 577.5 202.5L625.5 362.5C633.8 389.1 638 416.9 638 445.1C638 531.2 567.2 602 481.1 602H158.9C72.8 602 2 531.2 2 445.1C2 416.9 6.2 389.1 14.5 362.5L62.5 202.5C75.9 159.5 115.2 128 160 128H192V96zM256 96V128H384V96C384 78.33 369.7 64 352 64H288C270.3 64 256 78.33 256 96zM160 192C142.3 192 128 206.3 128 224C128 241.7 142.3 256 160 256C177.7 256 192 241.7 192 224C192 206.3 177.7 192 160 192zM480 192C462.3 192 448 206.3 448 224C448 241.7 462.3 256 480 256C497.7 256 512 241.7 512 224C512 206.3 497.7 192 480 192z" fill="#3379ff"/></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Bag</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">Customize your bag with layer colors, text, and logos</p>
            </button>

            <button onClick={() => handleSelectProduct("mobilecase")}
              className="group relative bg-zinc-900 cursor-pointer border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-8 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M208 64C172.7 64 144 92.7 144 128L144 512C144 547.3 172.7 576 208 576L432 576C467.3 576 496 547.3 496 512L496 128C496 92.7 467.3 64 432 64L208 64zM280 480L360 480C373.3 480 384 490.7 384 504C384 517.3 373.3 528 360 528L280 528C266.7 528 256 517.3 256 504C256 490.7 266.7 480 280 480z" fill="#3379ff"/></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Mobile Case</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">Design your phone case with colors, text, and stickers</p>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (screen === "tshirtVariant") {
    return (
      <main className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-4xl w-full px-6">
          <button
            onClick={() => setScreen("select")}
            className="mb-8 text-zinc-500 hover:text-zinc-300 transition flex items-center gap-2 text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to products
          </button>

          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold font-mono">T-Shirt / Jersey</span>
            <h1 className="text-4xl font-black text-white mt-3 mb-3">Choose Sleeve Style</h1>
            <p className="text-zinc-400 text-sm">Select the jersey structure before customizing layers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleSelectProduct("tshirt", "full-sleeves")}
              className="group relative bg-zinc-900 border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="relative h-48 mb-5 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                <NextImage
                  src="/products/tshirt/01---Body.png"
                  alt="Full sleeve jersey"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain p-4"
                />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Full Sleeves</h2>
              
            </button>

            <button
              onClick={() => handleSelectProduct("tshirt", "half-sleeves")}
              className="group relative bg-zinc-900 border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="relative h-48 mb-5 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                <NextImage
                  src="/products/tshirt/half-sleeves/01---Body.png"
                  alt="Half sleeve jersey"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain p-4"
                />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Half Sleeves</h2>
              
            </button>

            <button
              onClick={() => handleSelectProduct("tshirt", "sleevless")}
              className="group relative bg-zinc-900 border-2 border-zinc-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 text-left hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="relative h-48 mb-5 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                <NextImage
                  src="/products/tshirt/sleevless/01-Body.png"
                  alt="Sleeveless jersey"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain p-4"
                />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Sleeveless</h2>
              
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col md:flex-row h-screen max-h-screen overflow-hidden bg-zinc-950 text-zinc-100">

      {/* 1. LEFT WORKSPACE PANEL (non-scrollable) */}
      <section className="flex-1 relative flex flex-col items-center justify-between p-6 md:p-8 checkerboard-grid border-b md:border-b-0 md:border-r border-zinc-800 overflow-hidden">

        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button onClick={handleBackToHome}
              className="text-zinc-500 hover:text-zinc-300 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold font-mono">Custom Studio</span>
              <h1 className="text-xl md:text-2xl font-black text-white">
                {selectedProduct === "mobilecase" ? "Impact Cover Pro" : productConfig.product.productName}
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleExportConfig}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 transition glow-btn">
              Export JSON
            </button>
            <button
              onClick={() => {
                if (!confirm("Clear all canvas items?")) return;
                const eng = engineRef.current;
                if (!eng) return;
                eng.clearAll();
                setProductConfig((prev) => ({ ...prev, elements: [] }));
                setHasCoverImage(false);
                setTextInput("");
                setTextStepEnabled(null);
                setStickerStepEnabled(null);
                setLogoStepEnabled(null);
                if (selectedProduct === "mobilecase") {
                  setTextPositionName("Center");
                  setTextPositionX(160);
                  setTextPositionY(275);
                } else {
                  setTextPositionName("Center Chest");
                  setTextPositionX(165);
                  setTextPositionY(145);
                }
                updateLayersList();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 transition glow-btn"
            >
              Clear Canvas
            </button>
            <button
              onClick={handleExport}
              className="px-5 py-2 text-xs font-bold rounded-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg glow-btn"
            >
              Export PNG
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {selectedProduct === "tshirt" ? (
              <TshirtPreview
                materials={productConfig.materials || []}
                variant={tshirtVariant}
              />
            ) : selectedProduct === "bag" ? (
              <BagPreview
                materials={productConfig.materials || []}
              />
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
              <button onClick={() => setActiveView("back")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${activeView === "back" ? "bg-blue-600 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"}`}>Back Case</button>
              <button onClick={() => setActiveView("front")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${activeView === "front" ? "bg-blue-600 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"}`}>Front Glass</button>
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <button onClick={handle360Rotate} disabled={isRotating}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 transition glow-btn ${isRotating ? "opacity-50 cursor-not-allowed" : ""}`}>
              <svg className={`w-3.5 h-3.5 text-blue-400 ${isRotating ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
              </svg>
              {isRotating ? "Rotating..." : "360° View"}
            </button>
          </div>
        )}

      </section>

      {/* 2. RIGHT CONFIGURATOR CONTROL PANEL */}
      <section className="w-full md:w-105 flex flex-col bg-zinc-900 border-l border-zinc-800">

        <div className="flex items-center gap-0 px-6 pt-5 pb-3 bg-zinc-950/50 border-b border-zinc-800">
          {visibleSteps.map((label, idx) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-center w-full">
                <div className={`h-0.5 flex-1 ${idx === 0 ? "invisible" : idx <= currentStep ? "bg-blue-500" : "bg-zinc-800"}`} />
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${idx < currentStep ? "bg-blue-600 text-white" : idx === currentStep ? "bg-blue-500/20 border-2 border-blue-500 text-blue-400" : "bg-zinc-900 border border-zinc-700 text-zinc-500"}`}>
                  {idx < currentStep ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : idx + 1}
                </div>
                <div className={`h-0.5 flex-1 ${idx === visibleSteps.length - 1 ? "invisible" : idx < currentStep ? "bg-blue-500" : "bg-zinc-800"}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${idx === currentStep ? "text-blue-400" : "text-zinc-500"}`}>
                {label === "Stickers" && selectedProduct === "mobilecase" ? "Add Logo" : label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto">

          {/* STEP: Color */}
          {stepLabel === "Color" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">Layer Colors</h3>
                <p className="text-xs text-zinc-500">Customize each part of the product</p>
              </div>

              {selectedProduct === "mobilecase" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Back Color Presets</h4>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_PALETTES.flatMap((p) => p.colors).map((color) => {
                      const currentBackColor = (productConfig.materials || []).find((m) => m.layerName === "Back Color")?.colourHex || "#ffffff";
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
                      <span className="text-[10px] text-zinc-500 font-mono w-20 text-right truncate">{mat.colourName}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-zinc-800" />

            </div>
          )}

          {/* STEP: Text */}
          {stepLabel === "Text" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-1">Add Text</h3>
                  <p className="text-xs text-zinc-500 font-medium">Type custom words and style them</p>
                </div>
                {canvasLayers.length > 0 && (
                  <button onClick={handleDeleteSelected}
                    className="px-3 py-1.5 rounded text-[10px] font-bold border border-red-900 bg-red-950/20 text-red-400 hover:bg-red-950/40 transition">
                    Delete Selected
                  </button>
                )}
              </div>

              {textStepEnabled === null && (
                <div className="text-center py-8 space-y-4">
                  <p className="text-sm text-zinc-400">Do you want to add custom text?</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setTextStepEnabled(true)}
                      className="px-6 py-2.5 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition glow-btn">
                      Yes, Add Text
                    </button>
                    <button onClick={() => setCurrentStep((s) => s + 1)}
                      className="px-6 py-2.5 rounded text-xs font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 transition">
                      No, Skip
                    </button>
                  </div>
                </div>
              )}

              {textStepEnabled === true && (
                <>
                  {(productConfig.elements.filter((e) => e.type === "text").length === 0 || showTextAddForm) && (
                  <div className="space-y-2">
                    <textarea rows={2} value={textInput} onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type custom text..."
                      className="w-full px-4 py-3 text-sm font-medium rounded border border-zinc-700 bg-zinc-950 focus:outline-none focus:border-blue-500 text-white placeholder-zinc-500" />

                    {/* Text Position Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-500 font-bold">Position</label>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProduct === "mobilecase" ? Object.keys(MOBILECASE_TEXT_POSITIONS) : LOGO_POSITIONS).map((pos) => {
                          const positions = selectedProduct === "mobilecase" ? MOBILECASE_TEXT_POSITIONS : LOGO_POSITION_COORDS;
                          const p = positions[pos];
                          return (
                            <button key={pos} onClick={() => {
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
                          <input type="number" value={textPositionX}
                            onChange={(e) => { const v = parseFloat(e.target.value || "0"); setTextPositionX(v); }}
                            className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                        </div>
                        <div className="flex-1">
                          <label className="text-[9px] font-mono text-zinc-500">Y</label>
                          <input type="number" value={textPositionY}
                            onChange={(e) => { const v = parseFloat(e.target.value || "0"); setTextPositionY(v); }}
                            className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                        </div>
                      </div>
                    </div>

                    <button onClick={handleAddText} disabled={!textInput.trim()}
                      className="w-full py-2.5 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-40 disabled:cursor-not-allowed glow-btn">
                      Place Text on Design
                    </button>
                  </div>
                  )}

                  {productConfig.elements.filter((e) => e.type === "text").length > 0 && !showTextAddForm && (
                    <button onClick={() => setShowTextAddForm(true)}
                      className="w-full py-2.5 rounded text-xs font-bold border border-dashed border-zinc-600 text-zinc-400 hover:border-blue-500 hover:text-blue-400 transition">
                      + Add Another Text
                    </button>
                  )}

                  <div className="h-px bg-zinc-800" />

                  {/* Placed Text */}
                  {productConfig.elements.filter((e) => e.type === "text").length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Placed Text</h4>
                      {productConfig.elements.map((el, ei) => {
                        if (el.type !== "text") return null;
                        return el.applications.map((app, ai) => (
                            <div key={`text-${ei}-${ai}`} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${ei === 0 ? "bg-blue-400" : ei === 1 ? "bg-green-400" : ei === 2 ? "bg-purple-400" : "bg-orange-400"}`} />
                                  <span className="text-xs font-bold text-zinc-100">{app.positionName}</span>
                                </div>
                                <span className="text-[10px] text-zinc-500">{el.name}</span>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className="text-[9px] font-mono text-zinc-500">X</label>
                                  <input type="number" value={Number(app.offsetX.toFixed(2))} onChange={(e) => {
                                    const v = parseFloat(e.target.value || "0");
                                    setProductConfig((prev) => {
                                      const elements = [...prev.elements];
                                      const el2 = elements[ei];
                                      if (el2?.type === "text" && el2.applications[ai]) {
                                        const apps = [...el2.applications];
                                        apps[ai] = { ...apps[ai], offsetX: v };
                                        elements[ei] = { ...el2, applications: apps } as TextElement;
                                      }
                                      return { ...prev, elements };
                                    });
                                    const canvas = (engineRef.current as any).canvas;
                                    if (canvas) {
                                      const objs = canvas.getObjects();
                                      for (const o of objs) {
                                        if ((o as any)._textIndex === ei) {
                                          o.set({ left: v });
                                          break;
                                        }
                                      }
                                      canvas.renderAll();
                                    }
                                  }}
                                    className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                                </div>
                                <div className="flex-1">
                                  <label className="text-[9px] font-mono text-zinc-500">Y</label>
                                  <input type="number" value={Number(app.offsetY.toFixed(2))} onChange={(e) => {
                                    const v = parseFloat(e.target.value || "0");
                                    setProductConfig((prev) => {
                                      const elements = [...prev.elements];
                                      const el2 = elements[ei];
                                      if (el2?.type === "text" && el2.applications[ai]) {
                                        const apps = [...el2.applications];
                                        apps[ai] = { ...apps[ai], offsetY: v };
                                        elements[ei] = { ...el2, applications: apps } as TextElement;
                                      }
                                      return { ...prev, elements };
                                    });
                                    const canvas = (engineRef.current as any).canvas;
                                    if (canvas) {
                                      const objs = canvas.getObjects();
                                      for (const o of objs) {
                                        if ((o as any)._textIndex === ei) {
                                          o.set({ top: v });
                                          break;
                                        }
                                      }
                                      canvas.renderAll();
                                    }
                                  }}
                                    className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                                </div>
                              </div>
                              <button onClick={() => handleRemoveElement(ei)}
                                className="text-[10px] text-red-400 hover:text-red-300 font-bold">
                                Remove
                              </button>
                            </div>
                        ));
                      })}
                    </div>
                  )}

                  <div className="h-px bg-zinc-800" />

                  <div className="space-y-4">
                    {selectedObjectType === "text" ? (
                      <>
                        <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Select & Style</h4>

                        <div className="space-y-1">
                          <label className="text-[11px] text-zinc-500 font-bold">Font Family</label>
                          <select value={textFont} onChange={(e) => handleTextPropertyChange("fontFamily", e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded border border-zinc-700 bg-zinc-950 text-zinc-300 focus:outline-none focus:border-blue-500">
                        {FONTS.map((font) => (
                          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-500 font-bold">Font Color</label>
                      <div className="flex gap-2">
                        <input type="color" value={textColor} onChange={(e) => handleTextPropertyChange("fill", e.target.value)}
                          className="w-10 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5" />
                        <input type="text" value={textColor.toUpperCase()} onChange={(e) => handleTextPropertyChange("fill", e.target.value)}
                          maxLength={7} placeholder="#000000"
                          className="flex-1 px-3 py-1.5 text-xs font-semibold rounded border border-zinc-700 bg-zinc-950 focus:outline-none focus:border-blue-500 font-mono text-zinc-200" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-500 font-bold">
                        <span>Font Size</span>
                        <span>{textSize}px</span>
                      </div>
                      <input type="range" min={12} max={80} value={textSize}
                        onChange={(e) => handleTextPropertyChange("fontSize", parseInt(e.target.value))}
                        className="w-full accent-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleTextPropertyChange("fontWeight", isBold ? "normal" : "bold")}
                        className={`py-2 rounded text-xs font-extrabold border transition ${isBold ? "bg-zinc-800 border-blue-500 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"}`}>B</button>
                      <button onClick={() => handleTextPropertyChange("fontStyle", isItalic ? "normal" : "italic")}
                        className={`py-2 rounded text-xs italic font-bold border transition ${isItalic ? "bg-zinc-800 border-blue-500 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"}`}>I</button>
                    </div>

                    </>
                  ) : (
                    <div className="text-center py-8 border border-zinc-800 border-dashed rounded-xl bg-zinc-950/40">
                      <span className="text-xs text-zinc-500 block">Click on a text on the design to edit its properties</span>
                    </div>
                  )}
                </div>
              </>
            )}
            </div>
          )}

          {/* STEP: Logo (t-shirt only) */}
          {stepLabel === "Logo" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-1">Add Logo</h3>
                  <p className="text-xs text-zinc-500 font-medium">Place a logo on your design</p>
                </div>
                {canvasLayers.length > 0 && (
                  <button onClick={handleDeleteSelected}
                    className="px-3 py-1.5 rounded text-[10px] font-bold border border-red-900 bg-red-950/20 text-red-400 hover:bg-red-950/40 transition">
                    Delete Selected
                  </button>
                )}
              </div>

              {logoStepEnabled === null && (
                <div className="text-center py-8 space-y-4">
                  <p className="text-sm text-zinc-400">Do you want to add a logo?</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setLogoStepEnabled(true)}
                      className="px-6 py-2.5 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition glow-btn">
                      Yes, Add Logo
                    </button>
                    <button onClick={() => setCurrentStep((s) => s + 1)}
                      className="px-6 py-2.5 rounded text-xs font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 transition">
                      No, Skip
                    </button>
                  </div>
                </div>
              )}

              {logoStepEnabled === true && (
                <>
                  {(productConfig.elements.filter((e) => e.type === "logo").length === 0 || showLogoAddForm) && (
                  <>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select id="logo-position" value={logoPosition} onChange={(e) => setLogoPosition(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded border border-zinc-700 bg-zinc-950 text-zinc-300 focus:outline-none focus:border-blue-500">
                        {LOGO_POSITIONS.map((pos) => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[9px] font-mono text-zinc-500">Width (px)</label>
                        <input type="number" min={20} max={400} value={logoWidth} onChange={(e) => setLogoWidth(parseFloat(e.target.value || "0"))}
                          className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-mono text-zinc-500">Height (px)</label>
                        <input type="number" min={20} max={400} value={logoHeight} onChange={(e) => setLogoHeight(parseFloat(e.target.value || "0"))}
                          className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-zinc-800" />

                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-2">Upload Custom Logo</h4>
                    <div onClick={() => logoFileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition">
                      <input type="file" ref={logoFileInputRef} onChange={handleLogoImageUpload} accept="image/*" className="hidden" />
                      <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-xs font-bold text-blue-400">Upload PNG, JPG</span>
                    </div>
                  </div>
                  </>
                  )}

                  {productConfig.elements.filter((e) => e.type === "logo").length > 0 && !showLogoAddForm && (
                    <button onClick={() => setShowLogoAddForm(true)}
                      className="w-full py-2.5 rounded text-xs font-bold border border-dashed border-zinc-600 text-zinc-400 hover:border-blue-500 hover:text-blue-400 transition">
                      + Add Another Logo
                    </button>
                  )}

                  <div className="h-px bg-zinc-800" />

                  {productConfig.elements.filter((e) => e.type === "logo").length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Placed Logos</h4>
                      {productConfig.elements.map((el, ei) => {
                        if (el.type !== "logo") return null;
                        return el.applications.map((app, ai) => (
                          <div key={`${ei}-${ai}`} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${ei === 0 ? "bg-blue-400" : ei === 1 ? "bg-green-400" : ei === 2 ? "bg-purple-400" : "bg-orange-400"}`} />
                                <span className="text-xs font-bold text-zinc-100">{app.positionName}</span>
                              </div>
                              <span className="text-[10px] text-zinc-500">{el.name}</span>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-[9px] font-mono text-zinc-500">X</label>
                                <input type="number" value={Number(app.offsetX.toFixed(2))} onChange={(e) => {
                                  const v = parseFloat(e.target.value || "0");
                                  handleUpdateLogoOffset(ei, ai, v, app.offsetY);
                                }}
                                  className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                              </div>
                              <div className="flex-1">
                                <label className="text-[9px] font-mono text-zinc-500">Y</label>
                                <input type="number" value={Number(app.offsetY.toFixed(2))} onChange={(e) => {
                                  const v = parseFloat(e.target.value || "0");
                                  handleUpdateLogoOffset(ei, ai, app.offsetX, v);
                                }}
                                  className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                              </div>
                            </div>
                            <button onClick={() => handleRemoveElement(ei)}
                              className="text-[10px] text-red-400 hover:text-red-300 font-bold">
                              Remove
                            </button>
                          </div>
                        ));
                      })}
                    </div>
                  )}

                  {selectedObjectType === "image" && (
                    <div className="space-y-2 p-3 rounded-lg border border-zinc-800 bg-zinc-950/60">
                      <h4 className="text-[10px] font-mono font-bold uppercase text-zinc-500">Selected Image</h4>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[9px] font-mono text-zinc-500">Width</label>
                          <input type="number" min={10} max={500} value={selectedImageWidth || ""}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value || "0");
                              if (v > 0) {
                                engineRef.current?.updateSelectedSticker({ width: v });
                                setSelectedImageWidth(v);
                              }
                            }}
                            className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                        </div>
                        <div className="flex-1">
                          <label className="text-[9px] font-mono text-zinc-500">Height</label>
                          <input type="number" min={10} max={500} value={selectedImageHeight || ""}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value || "0");
                              if (v > 0) {
                                engineRef.current?.updateSelectedSticker({ height: v });
                                setSelectedImageHeight(v);
                              }
                            }}
                            className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* STEP: Stickers (Add Logo for mobile case) */}
          {stepLabel === "Stickers" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-1">Add Logo</h3>
                  <p className="text-xs text-zinc-500">Upload an image for your mobile case</p>
                </div>
                {canvasLayers.length > 0 && (
                  <button onClick={handleDeleteSelected}
                    className="px-3 py-1.5 rounded text-[10px] font-bold border border-red-900 bg-red-950/20 text-red-400 hover:bg-red-950/40 transition">
                    Delete Selected
                  </button>
                )}
              </div>

              {stickerStepEnabled === null && (
                <div className="text-center py-8 space-y-4">
                  <p className="text-sm text-zinc-400">Do you want to add a logo?</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setStickerStepEnabled(true)}
                      className="px-6 py-2.5 rounded text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition glow-btn">
                      Yes, Add Logo
                    </button>
                    <button onClick={() => setCurrentStep((s) => s + 1)}
                      className="px-6 py-2.5 rounded text-xs font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 transition">
                      No, Skip
                    </button>
                  </div>
                </div>
              )}

              {stickerStepEnabled === true && (
                <>
                  {(productConfig.elements.filter((e) => e.type === "logo").length === 0 || showMobileLogoAddForm) && (
                  <>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select value={mobileLogoPositionName} onChange={(e) => setMobileLogoPositionName(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded border border-zinc-700 bg-zinc-950 text-zinc-300 focus:outline-none focus:border-blue-500">
                        {Object.keys(MOBILECASE_TEXT_POSITIONS).map((pos) => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[9px] font-mono text-zinc-500">Width (px)</label>
                        <input type="number" min={20} max={400} value={mobileLogoWidth} onChange={(e) => setMobileLogoWidth(parseFloat(e.target.value || "0"))}
                          className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-mono text-zinc-500">Height (px)</label>
                        <input type="number" min={20} max={400} value={mobileLogoHeight} onChange={(e) => setMobileLogoHeight(parseFloat(e.target.value || "0"))}
                          className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-800" />

                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-2">Upload Logo Image</h4>
                    <div onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition">
                      <input type="file" ref={fileInputRef} onChange={(e) => {
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
                      }} accept="image/*" className="hidden" />
                      <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-xs font-bold text-blue-400">Upload PNG, JPG</span>
                    </div>
                  </div>
                  </>
                  )}

                  {productConfig.elements.filter((e) => e.type === "logo").length > 0 && !showMobileLogoAddForm && (
                    <button onClick={() => setShowMobileLogoAddForm(true)}
                      className="w-full py-2.5 rounded text-xs font-bold border border-dashed border-zinc-600 text-zinc-400 hover:border-blue-500 hover:text-blue-400 transition">
                      + Add Another Logo
                    </button>
                  )}

                  <div className="h-px bg-zinc-800" />

                  {productConfig.elements.filter((e) => e.type === "logo").length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Placed Logos</h4>
                      {productConfig.elements.map((el, ei) => {
                        if (el.type !== "logo") return null;
                        return el.applications.map((app, ai) => (
                          <div key={`${ei}-${ai}`} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-zinc-100">{app.positionName}</span>
                              <span className="text-[10px] text-zinc-500">{el.name}</span>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-[9px] font-mono text-zinc-500">X</label>
                                <input type="number" value={Number(app.offsetX.toFixed(2))} onChange={(e) => {
                                  const v = parseFloat(e.target.value || "0");
                                  handleUpdateLogoOffset(ei, ai, v, app.offsetY);
                                }}
                                  className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                              </div>
                              <div className="flex-1">
                                <label className="text-[9px] font-mono text-zinc-500">Y</label>
                                <input type="number" value={Number(app.offsetY.toFixed(2))} onChange={(e) => {
                                  const v = parseFloat(e.target.value || "0");
                                  handleUpdateLogoOffset(ei, ai, app.offsetX, v);
                                }}
                                  className="w-full px-2 py-1 text-xs rounded border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono" />
                              </div>
                            </div>
                            <button onClick={() => handleRemoveElement(ei)}
                              className="text-[10px] text-red-400 hover:text-red-300 font-bold">
                              Remove
                            </button>
                          </div>
                        ));
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* STEP: Review */}
          {stepLabel === "Review" && (
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
                    {selectedProduct === "tshirt" && <p>{productConfig.product.productLengthDesc}: {productConfig.product.sleeveLength}</p>}
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
                  <h4 className="text-[11px] font-mono font-bold text-zinc-500 uppercase">Layers ({canvasLayers.length})</h4>
                  <div className="space-y-1 max-h-45 overflow-y-auto pr-1">
                    {canvasLayers.map((layer) => (
                      <div key={layer.id} onClick={() => selectLayer(layer)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition cursor-pointer ${selectedLayerId === layer.id ? "bg-zinc-800 border-blue-500 text-blue-300" : "bg-zinc-950 border-zinc-800 hover:bg-zinc-900/60 text-zinc-400"}`}>
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

              <div className="h-px bg-zinc-800" />

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400">Export</h4>
                <button onClick={handleExport}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg glow-btn flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download High-Res PNG
                </button>
                <button onClick={handleExportConfig}
                  className="w-full py-3 rounded-xl text-sm font-bold border border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 transition flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Config JSON
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="border-t border-zinc-800 p-4 bg-zinc-950 flex items-center justify-between">
          <div>
            {currentStep > 0 ? (
              <button onClick={() => setCurrentStep((s) => s - 1)}
                className="px-5 py-2 rounded-lg text-xs font-bold border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition">Back</button>
            ) : (
              <span className="text-[10px] text-zinc-600 font-mono">
                {selectedProduct === "mobilecase" ? "iPhone 11 Pro Max" : productConfig.product.productName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < visibleSteps.length - 1 ? (
              <button onClick={() => {
                const onColorStep = visibleSteps[currentStep] === "Color";
                const allFilled = onColorStep
                  ? (productConfig.materials ?? []).every((m) => m.colourHex && m.colourHex.trim() !== "")
                  : true;
                if (!allFilled) return;
                setCurrentStep((s) => s + 1);
              }}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  visibleSteps[currentStep] === "Color" && !(productConfig.materials ?? []).every((m) => m.colourHex && m.colourHex.trim() !== "")
                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white glow-btn"
                }`}>Next Step</button>
            ) : (
              <button onClick={() => setCurrentStep(0)}
                className="px-5 py-2 rounded-lg text-xs font-bold border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition">Start Over</button>
            )}
          </div>
        </div>

      </section>

    </main>
  );
}
