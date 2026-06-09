import type { ProductType } from "./product-config";

// ─── Color Palettes ─────────────────────────────────────────────────────────

export interface PaletteColor {
  name: string;
  hex: string;
}

export interface Palette {
  name: string;
  colors: PaletteColor[];
}

export const PRESET_PALETTES: Palette[] = [
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

// ─── Font Options ────────────────────────────────────────────────────────────

export interface FontOption {
  name: string;
  value: string;
}

export const FONTS: FontOption[] = [
  { name: "Outfit (Modern)", value: "Outfit" },
  { name: "Pacifico (Script)", value: "Pacifico" },
  { name: "Montserrat (Chic)", value: "Montserrat" },
  { name: "Playfair Display (Classy)", value: "Playfair Display" },
  { name: "Cinzel (Classic)", value: "Cinzel" },
  { name: "Bungee (Retro)", value: "Bungee" },
  { name: "Lobster (Bold Script)", value: "Lobster" },
  { name: "Permanent Marker", value: "Permanent Marker" },
];

// ─── Sticker Presets ─────────────────────────────────────────────────────────

export interface StickerPreset {
  name: string;
  url: string;
}

export const STICKERS: StickerPreset[] = [
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

// ─── Position Coordinates ────────────────────────────────────────────────────

export interface PositionCoord {
  left: number;
  top: number;
}

// T-Shirt / Jersey positions
export const LOGO_POSITIONS = [
  "Left Breast",
  "Right Breast",
  "Center Chest",
  "Reverse",
];

export const LOGO_POSITION_COORDS: Record<string, PositionCoord> = {
  "Left Breast": { left: 222, top: 130 },
  "Right Breast": { left: 117, top: 145 },
  "Center Chest": { left: 165, top: 145 },
  "Reverse": { left: 475, top: 123 },
  "Left Sleeve": { left: 45, top: 170 },
  "Right Sleeve": { left: 286, top: 187 },
};

export const TEXT_POSITIONS: Record<string, PositionCoord> = {
  "Center": { left: 325, top: 250 },
  "Top Center": { left: 325, top: 120 },
  "Bottom Center": { left: 325, top: 380 },
  "Left Chest": { left: 200, top: 220 },
  "Right Chest": { left: 450, top: 220 },
};

// Bag positions
export const BAG_POSITIONS = [
  "Front Panel",
  "Back Panel",
  "Left Side",
  "Right Side",
  "Top",
];

export const BAG_POSITION_COORDS: Record<string, PositionCoord> = {
  "Front Panel": { left: 318, top: 245 },
  "Back Panel": { left: 430, top: 140 },
  "Left Side": { left: 80, top: 200 },
  "Right Side": { left: 530, top: 200 },
  "Top": { left: 300, top: 60 },
};

// Mobile Case positions
export const MOBILECASE_TEXT_POSITIONS: Record<string, PositionCoord> = {
  "Center": { left: 160, top: 275 },
  "Top": { left: 160, top: 120 },
  "Bottom": { left: 160, top: 420 },
};

// Shorts positions
export const SHORTS_POSITIONS = [
  "Left Leg",
  "Right Leg",
  "Back",
];

export const SHORTS_POSITION_COORDS: Record<string, PositionCoord> = {
  "Left Leg": { left: 400, top: 300 },
  "Right Leg": { left: 150, top: 300 },
  "Back": { left: 275, top: 150 },
};

// ─── Step Configuration ──────────────────────────────────────────────────────

export const ALL_STEPS = ["Color", "Text", "Logo", "Stickers", "Review"] as const;
export type StepName = (typeof ALL_STEPS)[number];

export function getVisibleSteps(productType: ProductType): readonly string[] {
  if (productType === "tshirt" || productType === "bag" || productType === "shorts")
    return ALL_STEPS.filter((s) => s !== "Stickers");
  return ALL_STEPS.filter((s) => s !== "Logo");
}

/**
 * Returns the correct position list and coordinate map for a given product type.
 */
export function getPositionsForProduct(productType: ProductType): {
  positions: string[];
  coords: Record<string, PositionCoord>;
  defaultPosition: string;
} {
  switch (productType) {
    case "bag":
      return {
        positions: BAG_POSITIONS,
        coords: BAG_POSITION_COORDS,
        defaultPosition: "Front Panel",
      };
    case "mobilecase":
      return {
        positions: Object.keys(MOBILECASE_TEXT_POSITIONS),
        coords: MOBILECASE_TEXT_POSITIONS,
        defaultPosition: "Center",
      };
    case "shorts":
      return {
        positions: SHORTS_POSITIONS,
        coords: SHORTS_POSITION_COORDS,
        defaultPosition: "Left Leg",
      };
    default:
      return {
        positions: LOGO_POSITIONS,
        coords: LOGO_POSITION_COORDS,
        defaultPosition: "Left Breast",
      };
  }
}

// ─── Dummy Logo ──────────────────────────────────────────────────────────────

export const DUMMY_LOGO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" fill="none"><rect width="200" height="100" rx="12" fill="%236366f1"/><rect x="8" y="8" width="184" height="84" rx="6" stroke="%23c7d2fe" stroke-width="2" fill="none"/><text x="100" y="58" text-anchor="middle" fill="white" font-size="32" font-weight="900" font-family="Arial">LOGO</text></svg>';
