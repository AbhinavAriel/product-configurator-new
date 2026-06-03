export type ProductType = "tshirt" | "mobilecase";

export interface ProductInfo {
  sleeveLength?: string;
  productName: string;
  productLengthDesc?: string;
  productType: ProductType;
}

export interface MaterialLayer {
  layerName: string;
  materialName?: string;
  gsm?: string;
  colourName: string;
  colourHex: string;
  colourPantone: string;
}

export interface LogoApplication {
  positionName: string;
  LogoBGColor?: string;
  appType: string;
  RecommendedSizes?: string;
  Image: string;
  ResizedLogo?: string;
  specialInstructions?: string;
  offsetX: number;
  offsetY: number;
  rotationDeg: number;
}

export interface LogoElement {
  name: string;
  type: "logo";
  applications: LogoApplication[];
}

export interface TextApplication {
  positionName: string;
  appType: string;
  fontName?: string;
  colourName?: string;
  colourHexc?: string;
  RecommendedSizes?: string;
  offsetX: number;
  offsetY: number;
  specialInstructions?: string;
  Image?: string;
}

export interface TextElement {
  name: string;
  type: "text";
  applications: TextApplication[];
}

export type ProductElement = LogoElement | TextElement;

export interface ProductConfig {
  product: ProductInfo;
  materials?: MaterialLayer[];
  caseColor?: string;
  pattern?: string;
  patternColor?: string;
  elements: ProductElement[];
}

export const DEFAULT_TSHIRT_CONFIG: ProductConfig = {
  product: {
    sleeveLength: "Long Sleeve",
    productName: "Custom Jersey",
    productLengthDesc: "Sleeve Length",
    productType: "tshirt",
  },
  materials: [
    {
      layerName: "Body",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Set Sleeve",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Collar",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Zapkam",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Zk",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
  ],
  elements: [],
};

export const DEFAULT_MOBILECASE_CONFIG: ProductConfig = {
  product: {
    productName: "Impact Cover Pro",
    productType: "mobilecase",
  },
  materials: [
    {
      layerName: "Back Color",
      colourName: "Default",
      colourHex: "#ffffff",
      colourPantone: "",
    },
    {
      layerName: "Camera Box",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
  ],
  pattern: "none",
  patternColor: "#000000",
  elements: [],
};
