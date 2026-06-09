"use client";

import { useState } from "react";
import type { ProductConfig, ProductType, TextElement, LogoElement, MaterialLayer } from "@configurator/core";
import {
  DEFAULT_TSHIRT_CONFIG,
  DEFAULT_HALF_SLEEVE_TSHIRT_CONFIG,
  DEFAULT_SLEEVELESS_TSHIRT_CONFIG,
  DEFAULT_BAG_CONFIG,
  DEFAULT_MOBILECASE_CONFIG,
  DEFAULT_SHORTS_CONFIG,
  getVisibleSteps,
  getPositionsForProduct,
  exportTshirtPng,
  exportBagPng,
  exportMobileCasePng,
  exportShortsPng,
  downloadDataUrl,
} from "@configurator/core";
import { useConfiguratorEngine } from "@/hooks/useConfiguratorEngine";

// Screens
import ProductSelectScreen from "@/components/screens/ProductSelectScreen";
import TshirtVariantScreen from "@/components/screens/TshirtVariantScreen";

// Panels & Steps
import WorkspacePanel from "@/components/configurator/WorkspacePanel";
import ControlPanel from "@/components/configurator/ControlPanel";
import ColorStep from "@/components/configurator/steps/ColorStep";
import TextStep from "@/components/configurator/steps/TextStep";
import LogoStep from "@/components/configurator/steps/LogoStep";
import StickerStep from "@/components/configurator/steps/StickerStep";
import ReviewStep from "@/components/configurator/steps/ReviewStep";

// Preview Data
import { TSHIRT_LAYER_PRESETS } from "@/components/JerseyPreview";
import { BAG_LAYER_PRESETS } from "@/components/BagPreview";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [tshirtVariant, setTshirtVariant] = useState<string | null>(null);
  const [productConfig, setProductConfig] = useState<ProductConfig | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Mobile case view state
  const [activeView, setActiveView] = useState<"back" | "front">("back");

  // Engine Hook
  const {
    engineRef,
    canvasLayers,
    selectedLayerId,
    selectedObjectType,
    handleEngineReady,
    updateLayersList,
    syncProperties,
  } = useConfiguratorEngine(selectedProduct as ProductType, tshirtVariant || "", activeView, setProductConfig as any);

  // ─── Step States ────────────────────────────────────────────────────────────

  const [textStepEnabled, setTextStepEnabled] = useState<boolean | null>(null);
  const [showTextAddForm, setShowTextAddForm] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [textFont, setTextFont] = useState("Outfit");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(20);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textPositionName, setTextPositionName] = useState("");
  const [textPositionX, setTextPositionX] = useState(0);
  const [textPositionY, setTextPositionY] = useState(0);

  const [logoStepEnabled, setLogoStepEnabled] = useState<boolean | null>(null);
  const [showLogoAddForm, setShowLogoAddForm] = useState(true);
  const [logoWidth, setLogoWidth] = useState(100);
  const [logoHeight, setLogoHeight] = useState(100);
  const [logoPosition, setLogoPosition] = useState("");
  const [selectedImageWidth, setSelectedImageWidth] = useState(0);
  const [selectedImageHeight, setSelectedImageHeight] = useState(0);

  const [stickerStepEnabled, setStickerStepEnabled] = useState<boolean | null>(null);
  const [showMobileLogoAddForm, setShowMobileLogoAddForm] = useState(true);
  const [mobileLogoWidth, setMobileLogoWidth] = useState(80);
  const [mobileLogoHeight, setMobileLogoHeight] = useState(80);
  const [mobileLogoPositionName, setMobileLogoPositionName] = useState("Center");

  // ─── Navigation Handlers ────────────────────────────────────────────────────

  const handleSelectProduct = (product: ProductType) => {
    setSelectedProduct(product);
    const { positions, coords, defaultPosition } = getPositionsForProduct(product);

    if (product === "tshirt") {
      setProductConfig(DEFAULT_TSHIRT_CONFIG);
      setTextPositionName(positions[0] || "");
      setTextPositionX(coords[positions[0]]?.left || 0);
      setTextPositionY(coords[positions[0]]?.top || 0);
      setLogoPosition(defaultPosition);
    } else if (product === "bag") {
      setProductConfig(DEFAULT_BAG_CONFIG);
      setTextPositionName(positions[0] || "");
      setTextPositionX(coords[positions[0]]?.left || 0);
      setTextPositionY(coords[positions[0]]?.top || 0);
      setLogoPosition(defaultPosition);
    } else if (product === "mobilecase") {
      setProductConfig(DEFAULT_MOBILECASE_CONFIG);
      setMobileLogoPositionName(defaultPosition);
      setTshirtVariant(null);
    } else if (product === "shorts") {
      setProductConfig(DEFAULT_SHORTS_CONFIG);
      setTextPositionName(positions[0] || "");
      setTextPositionX(coords[positions[0]]?.left || 0);
      setTextPositionY(coords[positions[0]]?.top || 0);
      setLogoPosition(defaultPosition);
      setTshirtVariant(null);
    }
  };

  const resetState = () => {
    setSelectedProduct(null);
    setTshirtVariant(null);
    setProductConfig(null);
    setCurrentStep(0);
    setActiveView("back");
    setTextStepEnabled(null);
    setLogoStepEnabled(null);
    setStickerStepEnabled(null);
    engineRef.current?.clearAll();
  };

  // ─── Design Logic ──────────────────────────────────────────────────────────

  const updateMaterialColor = (layerName: string, colourHex: string) => {
    setProductConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        materials: (prev.materials || []).map((m: MaterialLayer) =>
          m.layerName === layerName ? { ...m, colourHex } : m
        ),
      };
    });
  };

  const handleAddText = () => {
    if (!productConfig || !textInput.trim() || !engineRef.current) return;
    const newTextElement: TextElement = {
      type: "text",
      name: textInput,
      applications: [
        {
          appType: "text",
          positionName: textPositionName,
          offsetX: textPositionX,
          offsetY: textPositionY,
        },
      ],
    };
    const elementIndex = productConfig.elements.length;
    setProductConfig((prev) => prev && ({ ...prev, elements: [...prev.elements, newTextElement] }));
    engineRef.current.addText(textInput, {
      fontFamily: textFont,
      fill: textColor,
      fontSize: textSize,
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      left: textPositionX,
      top: textPositionY,
      _textIndex: elementIndex,
    });
    setTextInput("");
    setShowTextAddForm(false);
  };

  const handleAddLogo = async (logoUrl: string, positionName: string) => {
    if (!productConfig || !engineRef.current) return;
    const { coords } = getPositionsForProduct(selectedProduct as ProductType);
    const p = coords[positionName] || { left: 100, top: 100 };
    const newLogo: LogoElement = {
      type: "logo",
      name: `Logo ${productConfig.elements.length + 1}`,
      applications: [{ appType: "logo", Image: logoUrl, rotationDeg: 0, positionName, offsetX: p.left, offsetY: p.top }],
    };
    const elementIndex = productConfig.elements.length;
    setProductConfig((prev) => prev && ({ ...prev, elements: [...prev.elements, newLogo] }));
    engineRef.current.addSticker(logoUrl, {
      left: p.left,
      top: p.top,
      width: logoWidth,
      height: logoHeight,
      _logoIndex: elementIndex,
    });
    setShowLogoAddForm(false);
  };

  const handleAddMobileLogo = async (logoUrl: string, positionName: string) => {
    if (!productConfig || !engineRef.current) return;
    const { coords } = getPositionsForProduct(selectedProduct as ProductType);
    const p = coords[positionName] || { left: 100, top: 100 };
    const newLogo: LogoElement = {
      type: "logo",
      name: `Logo ${productConfig.elements.length + 1}`,
      applications: [{ appType: "logo", Image: logoUrl, rotationDeg: 0, positionName, offsetX: p.left, offsetY: p.top }],
    };
    const elementIndex = productConfig.elements.length;
    setProductConfig((prev) => prev && ({ ...prev, elements: [...prev.elements, newLogo] }));
    engineRef.current.addSticker(logoUrl, {
      left: p.left,
      top: p.top,
      width: mobileLogoWidth,
      height: mobileLogoHeight,
      _logoIndex: elementIndex,
    });
    setShowMobileLogoAddForm(false);
  };

  const handleRemoveElement = (index: number) => {
    const canvas = (engineRef.current as any)?.canvas;
    if (canvas) {
      const objs = canvas.getObjects();

      // 1. Remove the target object
      for (const o of objs) {
        if (o._logoIndex === index || o._textIndex === index) {
          canvas.remove(o);
          break;
        }
      }

      // 2. Re-index remaining objects to match the new React state array
      for (const o of objs) {
        if (o._logoIndex !== undefined && o._logoIndex > index) {
          o._logoIndex--;
        }
        if (o._textIndex !== undefined && o._textIndex > index) {
          o._textIndex--;
        }
      }

      canvas.renderAll();
      updateLayersList();
    }

    setProductConfig((prev) => {
      if (!prev) return prev;
      return { ...prev, elements: prev.elements.filter((_, i) => i !== index) };
    });
  };

  const handleTextPropertyChange = (property: string, value: any) => {
    if (property === "fontFamily") setTextFont(value);
    if (property === "fill") setTextColor(value);
    if (property === "fontSize") setTextSize(value);
    if (property === "fontWeight") setIsBold(value === "bold");
    if (property === "fontStyle") setIsItalic(value === "italic");
    engineRef.current?.updateSelectedText({ [property]: value });
  };

  const handleUpdateLogoOffset = (ei: number, ai: number, x: number, y: number) => {
    setProductConfig((prev) => {
      if (!prev) return prev;
      const elements = [...prev.elements];
      const el = elements[ei];
      if (el?.type === "logo" && el.applications[ai]) {
        const apps = [...el.applications];
        apps[ai] = { ...apps[ai], offsetX: x, offsetY: y };
        elements[ei] = { ...el, applications: apps } as LogoElement;
      }
      return { ...prev, elements };
    });
    const canvas = (engineRef.current as any)?.canvas;
    if (canvas) {
      const objs = canvas.getObjects();
      for (const o of objs) {
        if (o._logoIndex === ei) {
          o.set({ left: x, top: y });
          break;
        }
      }
      canvas.renderAll();
    }
  };

  // ─── Exports ────────────────────────────────────────────────────────────────

  const handleExportConfig = () => {
    if (!productConfig) return;
    const jsonStr = JSON.stringify(productConfig, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    downloadDataUrl(url, `config-${selectedProduct}.json`);
    URL.revokeObjectURL(url);
  };

  const handleExportPng = async () => {
    if (!engineRef.current || !productConfig) return;
    (engineRef.current as any).canvas?.discardActiveObject();
    const fabricCanvas = (engineRef.current as any).canvas.getElement();
    let dataUrl = "";
    if (selectedProduct === "tshirt" && tshirtVariant) {
      const preset = TSHIRT_LAYER_PRESETS[tshirtVariant as keyof typeof TSHIRT_LAYER_PRESETS];
      dataUrl = await exportTshirtPng({ materials: productConfig.materials || [], preset, fabricCanvas });
    } else if (selectedProduct === "bag") {
      const preset = BAG_LAYER_PRESETS;
      dataUrl = await exportBagPng({
        materials: productConfig.materials || [],
        layerOrder: preset.order,
        layerImages: preset.images,
        fabricCanvas,
      });
    } else if (selectedProduct === "shorts") {
      dataUrl = await exportShortsPng({
        materials: productConfig.materials || [],
        fabricCanvas,
      });
    } else if (selectedProduct === "mobilecase") {
      dataUrl = await exportMobileCasePng({
        materials: productConfig.materials || [],
        pattern: productConfig.pattern,
        patternColor: productConfig.patternColor,
        fabricCanvas,
      });
    }
    if (dataUrl) downloadDataUrl(dataUrl, `design-${selectedProduct}.png`);
  };

  // ─── Render Pipeline ────────────────────────────────────────────────────────

  if (!selectedProduct) {
    return (
      <ProductSelectScreen
        onSelectTshirt={() => handleSelectProduct("tshirt")}
        onSelectBag={() => handleSelectProduct("bag")}
        onSelectMobileCase={() => handleSelectProduct("mobilecase")}
        onSelectShorts={() => handleSelectProduct("shorts")}
      />
    );
  }

  if (selectedProduct === "tshirt" && !tshirtVariant) {
    return (
      <TshirtVariantScreen
        onBack={() => setSelectedProduct(null)}
        onSelectVariant={(variant) => {
          setTshirtVariant(variant);
          if (variant === "half-sleeves") {
            setProductConfig(DEFAULT_HALF_SLEEVE_TSHIRT_CONFIG);
          } else if (variant === "sleevless") {
            setProductConfig(DEFAULT_SLEEVELESS_TSHIRT_CONFIG);
          } else {
            setProductConfig(DEFAULT_TSHIRT_CONFIG);
          }
        }}
      />
    );
  }

  if (!productConfig) return null;

  const visibleSteps = getVisibleSteps(selectedProduct);
  const stepLabel = visibleSteps[currentStep];

  const canProceedToNextStep =
    stepLabel !== "Color" ||
    (productConfig.materials ?? []).every((m) => m.colourHex && m.colourHex.trim() !== "");

  return (
    <main className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <WorkspacePanel
        selectedProduct={selectedProduct}
        productConfig={productConfig}
        tshirtVariant={tshirtVariant as any}
        activeView={activeView}
        setActiveView={setActiveView}
        handleBackToHome={resetState}
        handleExportConfig={handleExportConfig}
        handleClearCanvas={() => engineRef.current?.clearAll()}
        handleExportPng={handleExportPng}
        handleEngineReady={handleEngineReady}
      />

      <ControlPanel
        selectedProduct={selectedProduct}
        productName={productConfig.product.productName}
        visibleSteps={visibleSteps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        canProceedToNextStep={canProceedToNextStep}
      >
        {stepLabel === "Color" && (
          <ColorStep
            selectedProduct={selectedProduct}
            productConfig={productConfig}
            setProductConfig={setProductConfig as any}
            updateMaterialColor={updateMaterialColor}
          />
        )}

        {stepLabel === "Text" && (
          <TextStep
            selectedProduct={selectedProduct}
            productConfig={productConfig}
            setProductConfig={setProductConfig as any}
            engineRef={engineRef}
            textInput={textInput}
            setTextInput={setTextInput}
            textFont={syncProperties.syncFont}
            setTextFont={setTextFont}
            textColor={syncProperties.syncColor}
            setTextColor={setTextColor}
            textSize={syncProperties.syncSize}
            setTextSize={setTextSize}
            isBold={syncProperties.syncBold}
            isItalic={syncProperties.syncItalic}
            textPositionName={textPositionName}
            setTextPositionName={setTextPositionName}
            textPositionX={textPositionX}
            setTextPositionX={setTextPositionX}
            textPositionY={textPositionY}
            setTextPositionY={setTextPositionY}
            textAlignment={syncProperties.syncAlign}
            textStepEnabled={textStepEnabled}
            setTextStepEnabled={setTextStepEnabled}
            showTextAddForm={showTextAddForm}
            setShowTextAddForm={setShowTextAddForm}
            selectedObjectType={selectedObjectType}
            setCurrentStep={setCurrentStep}
            handleAddText={handleAddText}
            handleTextPropertyChange={handleTextPropertyChange}
            handleRemoveElement={handleRemoveElement}
          />
        )}

        {stepLabel === "Logo" && (
          <LogoStep
            selectedProduct={selectedProduct}
            productConfig={productConfig}
            engineRef={engineRef}
            logoWidth={logoWidth}
            setLogoWidth={setLogoWidth}
            logoHeight={logoHeight}
            setLogoHeight={setLogoHeight}
            logoPosition={logoPosition}
            setLogoPosition={setLogoPosition}
            logoStepEnabled={logoStepEnabled}
            setLogoStepEnabled={setLogoStepEnabled}
            showLogoAddForm={showLogoAddForm}
            setShowLogoAddForm={setShowLogoAddForm}
            selectedObjectType={selectedObjectType}
            selectedImageWidth={syncProperties.syncImageWidth}
            setSelectedImageWidth={setSelectedImageWidth}
            selectedImageHeight={syncProperties.syncImageHeight}
            setSelectedImageHeight={setSelectedImageHeight}
            setCurrentStep={setCurrentStep}
            handleAddLogo={handleAddLogo}
            handleUpdateLogoOffset={handleUpdateLogoOffset}
            handleRemoveElement={handleRemoveElement}
          />
        )}

        {stepLabel === "Stickers" && (
          <StickerStep
            productConfig={productConfig}
            mobileLogoWidth={mobileLogoWidth}
            setMobileLogoWidth={setMobileLogoWidth}
            mobileLogoHeight={mobileLogoHeight}
            setMobileLogoHeight={setMobileLogoHeight}
            mobileLogoPositionName={mobileLogoPositionName}
            setMobileLogoPositionName={setMobileLogoPositionName}
            stickerStepEnabled={stickerStepEnabled}
            setStickerStepEnabled={setStickerStepEnabled}
            showMobileLogoAddForm={showMobileLogoAddForm}
            setShowMobileLogoAddForm={setShowMobileLogoAddForm}
            setCurrentStep={setCurrentStep}
            handleAddMobileLogo={handleAddMobileLogo}
            handleUpdateLogoOffset={handleUpdateLogoOffset}
            handleRemoveElement={handleRemoveElement}
          />
        )}

        {stepLabel === "Review" && (
          <ReviewStep
            selectedProduct={selectedProduct}
            productConfig={productConfig}
            canvasLayers={canvasLayers}
            selectedLayerId={selectedLayerId}
            selectLayer={(layer) => {
              const canvas = (engineRef.current as any)?.canvas;
              if (canvas) {
                const obj = canvas.getObjects().find((o: any) => o.id === layer.id);
                if (obj) {
                  canvas.setActiveObject(obj);
                  canvas.renderAll();
                }
              }
            }}
            handleExport={handleExportPng}
            handleExportConfig={handleExportConfig}
            handleBringToFront={() => {
              engineRef.current?.bringToFront();
              updateLayersList();
            }}
            handleSendToBack={() => {
              engineRef.current?.sendToBack();
              updateLayersList();
            }}
            handleDuplicateSelected={() => {
              engineRef.current?.duplicateSelected();
              updateLayersList();
            }}
            handleDeleteSelected={() => {
              engineRef.current?.deleteSelected();
              updateLayersList();
            }}
          />
        )}
      </ControlPanel>
    </main>
  );
}
