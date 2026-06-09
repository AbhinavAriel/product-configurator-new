import type { MaterialLayer } from "./product-config";

/**
 * Load an image from a URL and return the HTMLImageElement.
 * Framework-agnostic — works in any browser environment.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

/**
 * Draw a layer image onto an offscreen canvas, tinted by the given color.
 * If no color, draws the raw image.
 */
function drawTintedLayer(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  color: string,
  hideOverlay: boolean = false,
  blendMode: string = "hard-light"
) {
  if (color) {
    // 1. Create the color mask shaped exactly like the image
    const temp = document.createElement("canvas");
    temp.width = w;
    temp.height = h;
    const tctx = temp.getContext("2d")!;
    tctx.drawImage(img, 0, 0, w, h);
    tctx.globalCompositeOperation = "source-in";
    tctx.fillStyle = color;
    tctx.fillRect(0, 0, w, h);

    // 2. Draw the flat color mask onto the main canvas
    ctx.drawImage(temp, 0, 0);

    // 3. Blend the original shading/texture image on top using the specified blend mode
    if (!hideOverlay) {
      const prevOp = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
      ctx.drawImage(img, 0, 0, w, h);
      ctx.globalCompositeOperation = prevOp;
    }
  } else {
    ctx.drawImage(img, 0, 0, w, h);
  }
}

/**
 * Convert hex color to rgba string.
 */
function toRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Get an SVG pattern string for the given pattern type and color.
 */
function getPatternSvg(pattern: string, patternColor: string): string {
  switch (pattern) {
    case "lines":
      return `<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><rect y="0" width="10" height="2" fill="${toRgba(patternColor, 0.3)}"/></svg>`;
    case "dots":
      return `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="1.5" fill="${toRgba(patternColor, 0.35)}"/></svg>`;
    case "waves":
      return `<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 10 Q10 0 20 10 Q30 20 40 10" stroke="${toRgba(patternColor, 0.25)}" stroke-width="2" fill="none"/></svg>`;
    default:
      return "";
  }
}

// ─── Export Config ────────────────────────────────────────────────────────────

export interface TshirtLayerPreset {
  clipPath: string;
  order: string[];
  images: Record<string, string>;
  materialAlias?: Record<string, string>;
  colorSource?: Record<string, string>;
}

export interface ExportTshirtOptions {
  materials: MaterialLayer[];
  preset: TshirtLayerPreset;
  fabricCanvas: HTMLCanvasElement;
}

export interface ExportBagOptions {
  materials: MaterialLayer[];
  layerOrder: string[];
  layerImages: Record<string, string>;
  fabricCanvas: HTMLCanvasElement;
}

export interface ExportMobileCaseOptions {
  materials: MaterialLayer[];
  pattern?: string;
  patternColor?: string;
  fabricCanvas: HTMLCanvasElement;
}

export interface ExportShortsOptions {
  materials: MaterialLayer[];
  fabricCanvas: HTMLCanvasElement;
}

/**
 * Export a t-shirt design as a PNG data URL.
 */
export async function exportTshirtPng(options: ExportTshirtOptions): Promise<string> {
  const { materials, preset, fabricCanvas } = options;
  const W = 650;
  const H = 433;

  const offscreen = document.createElement("canvas");
  offscreen.width = W;
  offscreen.height = H;
  const ctx = offscreen.getContext("2d")!;

  for (const name of preset.order) {
    const src = preset.images[name];
    if (!src) continue;

    const matKey = preset.materialAlias?.[name] || name;
    const mat = materials.find((m) => m.layerName === matKey);
    let color = "";

    if (preset.colorSource?.[name]) {
      const sourceMat = materials.find(
        (m) => m.layerName === preset.colorSource?.[name]
      );
      if (sourceMat?.colourHex) color = sourceMat.colourHex;
    } else if (mat?.colourHex) {
      color = mat.colourHex;
    }

    const img = await loadImage(src);
    drawTintedLayer(ctx, img, W, H, color);
  }

  ctx.drawImage(fabricCanvas, 0, 0, W, H);
  return offscreen.toDataURL("image/png");
}

/**
 * Export a bag design as a PNG data URL.
 */
export async function exportBagPng(options: ExportBagOptions): Promise<string> {
  const { materials, layerOrder, layerImages, fabricCanvas } = options;
  const W = 650;
  const H = 433;

  const offscreen = document.createElement("canvas");
  offscreen.width = W;
  offscreen.height = H;
  const ctx = offscreen.getContext("2d")!;

  for (const name of layerOrder) {
    const src = layerImages[name];
    if (!src) continue;

    const mat = materials.find((m) => m.layerName === name);
    const color = mat?.colourHex || "";

    const img = await loadImage(src);
    drawTintedLayer(ctx, img, W, H, color, false, "multiply");
  }

  ctx.drawImage(fabricCanvas, 0, 0, W, H);
  return offscreen.toDataURL("image/png");
}

/**
 * Export a mobile case design as a PNG data URL.
 */
export async function exportMobileCasePng(
  options: ExportMobileCaseOptions
): Promise<string> {
  const { materials, pattern, patternColor = "#000000", fabricCanvas } = options;
  const W = 485;
  const H = 955;

  const offscreen = document.createElement("canvas");
  offscreen.width = W;
  offscreen.height = H;
  const ctx = offscreen.getContext("2d")!;

  const activePattern = pattern;

  const BACK_LAYERS: { file: string; colorKey?: string; isPattern?: boolean }[] = [
    { file: "back-full-color.png", colorKey: "Back Color" },
    ...(activePattern && activePattern !== "none"
      ? [{ file: "back-full-color.png", isPattern: true }]
      : []),
    { file: "back-camera-box.png", colorKey: "Camera Box" },
    { file: "back-camera.png" },
  ];

  for (const layer of BACK_LAYERS) {
    if (layer.isPattern) {
      const patSvg = getPatternSvg(activePattern || "", patternColor);
      if (!patSvg) continue;
      const blob = new Blob([patSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const patImg = await loadImage(url);
      URL.revokeObjectURL(url);

      const maskImg = await loadImage("/products/phone-cover/back-full-color.png");

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
      const mat = materials.find((m) => m.layerName === layer.colorKey);
      if (mat?.colourHex) color = mat.colourHex;
    }

    drawTintedLayer(ctx, img, W, H, color, true);
  }

  ctx.drawImage(fabricCanvas, 0, 0, W, H);
  return offscreen.toDataURL("image/png");
}

/**
 * Trigger a browser download of a data URL.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Export a shorts design as a PNG data URL.
 */
export async function exportShortsPng(options: ExportShortsOptions): Promise<string> {
  const { materials, fabricCanvas } = options;
  const W = 650;
  const H = 433;

  const offscreen = document.createElement("canvas");
  offscreen.width = W;
  offscreen.height = H;
  const ctx = offscreen.getContext("2d")!;

  const SHORTS_LAYERS = [
    { name: "Body", file: "01-Body.png" },
    { name: "Detail", file: "02-Detail.png" },
    { name: "ZK Logo", file: "03-ZK-Logo.png" },
  ];

  for (const layer of SHORTS_LAYERS) {
    const src = `/products/shorts/${layer.file}`;
    const mat = materials.find((m) => m.layerName === layer.name);
    const color = mat?.colourHex || "";

    const img = await loadImage(src);
    drawTintedLayer(ctx, img, W, H, color, false, "multiply");
  }

  ctx.drawImage(fabricCanvas, 0, 0, W, H);
  return offscreen.toDataURL("image/png");
}

/**
 * Export the full product configuration as a JSON file.
 */
export function exportConfigJson(config: any): void {
  const jsonStr = JSON.stringify(config, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.download = `${config.product.productName.replace(/\s+/g, "_")}_Config.json`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
}
