import { useState, useCallback, useRef, useEffect } from "react";
import type { ConfiguratorEngine, ProductConfig, ProductType } from "@configurator/core";

export function useConfiguratorEngine(
  selectedProduct: ProductType,
  tshirtVariant: string,
  activeView: string,
  setProductConfig: React.Dispatch<React.SetStateAction<ProductConfig>>
) {
  const engineRef = useRef<ConfiguratorEngine | null>(null);

  const [canvasLayers, setCanvasLayers] = useState<any[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [selectedObjectType, setSelectedObjectType] = useState<string | null>(null);
  const [hasCoverImage, setHasCoverImage] = useState(false);

  // Synced properties from canvas objects
  const [syncFont, setSyncFont] = useState("Outfit");
  const [syncColor, setSyncColor] = useState("#000000");
  const [syncSize, setSyncSize] = useState(26);
  const [syncBold, setSyncBold] = useState(false);
  const [syncItalic, setSyncItalic] = useState(false);
  const [syncAlign, setSyncAlign] = useState<"left" | "center" | "right">("center");
  const [syncX, setSyncX] = useState(0);
  const [syncY, setSyncY] = useState(0);
  const [syncImageWidth, setSyncImageWidth] = useState(0);
  const [syncImageHeight, setSyncImageHeight] = useState(0);

  const updateLayersList = useCallback(() => {
    const eng = engineRef.current;
    if (!eng) return;
    const canvas = (eng as any).canvas;
    if (!canvas) return;

    const objects = canvas.getObjects();
    const customizable = objects.filter((obj: any) => obj.selectable && obj.type !== "rect");

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

  const syncTextProperties = useCallback((obj: any) => {
    if (!obj) return;
    setSelectedObjectType(obj.type === "textbox" ? "text" : "image");
    if (obj.type === "textbox") {
      setSyncFont(obj.fontFamily || "Outfit");
      setSyncColor(obj.fill || "#000000");
      setSyncSize(obj.fontSize || 32);
      setSyncBold(obj.fontWeight === "bold");
      setSyncItalic(obj.fontStyle === "italic");
      setSyncAlign(obj.textAlign || "center");
      setSyncX(obj.left || 0);
      setSyncY(obj.top || 0);
    } else {
      setSyncImageWidth(Math.round(obj.width * obj.scaleX * 100) / 100);
      setSyncImageHeight(Math.round(obj.height * obj.scaleY * 100) / 100);
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
          if (e.target) syncTextProperties(e.target);
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
                  apps[0] = {
                    ...apps[0],
                    offsetX: Math.round((obj as any).left * 100) / 100,
                    offsetY: Math.round((obj as any).top * 100) / 100,
                  };
                  elements[logoIndex] = { ...el, applications: apps } as any;
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
                  apps[0] = {
                    ...apps[0],
                    offsetX: Math.round((obj as any).left * 100) / 100,
                    offsetY: Math.round((obj as any).top * 100) / 100,
                  };
                  elements[textIndex] = { ...el, applications: apps } as any;
                }
                return { ...prev, elements };
              });
            }
          }
        });
      }

      // Initial clip path setup
      if (selectedProduct === "tshirt") {
        import("@/components/JerseyPreview").then(({ TSHIRT_LAYER_PRESETS }) => {
          const preset = TSHIRT_LAYER_PRESETS[tshirtVariant as keyof typeof TSHIRT_LAYER_PRESETS];
          if (preset && preset.clipPath) eng.setClipPath(preset.clipPath);
        });
      } else if (selectedProduct === "bag") {
        import("@/components/BagPreview").then(({ BAG_LAYER_PRESETS }) => {
          eng.setClipPath(BAG_LAYER_PRESETS.clipPath);
        });
      } else if (selectedProduct === "mobilecase" && activeView === "back") {
        eng.setClipPath("/products/phone-cover/back-full-color.png");
      }
    },
    [updateLayersList, syncTextProperties, selectedProduct, activeView, tshirtVariant, setProductConfig]
  );

  // Update clip path on product/view change
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;
    if (selectedProduct === "tshirt") {
      import("@/components/JerseyPreview").then(({ TSHIRT_LAYER_PRESETS }) => {
        const preset = TSHIRT_LAYER_PRESETS[tshirtVariant as keyof typeof TSHIRT_LAYER_PRESETS];
        if (preset && preset.clipPath) eng.setClipPath(preset.clipPath);
      });
    } else if (selectedProduct === "bag") {
      import("@/components/BagPreview").then(({ BAG_LAYER_PRESETS }) => {
        eng.setClipPath(BAG_LAYER_PRESETS.clipPath);
      });
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

  // Cleanup
  useEffect(() => {
    return () => {
      const eng = engineRef.current;
      if (eng) {
        const canvas = (eng as any).canvas;
        if (canvas) canvas.off();
      }
    };
  }, []);

  return {
    engineRef,
    canvasLayers,
    selectedLayerId,
    selectedObjectType,
    hasCoverImage,
    setHasCoverImage,
    handleEngineReady,
    updateLayersList,
    syncProperties: {
      syncFont,
      syncColor,
      syncSize,
      syncBold,
      syncItalic,
      syncAlign,
      syncX,
      syncY,
      syncImageWidth,
      syncImageHeight,
    },
  };
}
