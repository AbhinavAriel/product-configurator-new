export type ProductType = "tshirt" | "bag" | "mobilecase";

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
    sleeveLength: "Full Sleeves",
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

export const DEFAULT_HALF_SLEEVE_TSHIRT_CONFIG: ProductConfig = {
  product: {
    sleeveLength: "Half Sleeve",
    productName: "Custom Half Sleeve Jersey",
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
      layerName: "Outer Design",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Middle Design",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Set Sleeves",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Inner Placket",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Front Placket",
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

export const DEFAULT_SLEEVELESS_TSHIRT_CONFIG: ProductConfig = {
  product: {
    sleeveLength: "Sleeveless",
    productName: "Custom Sleeveless Jersey",
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
      layerName: "Colour 1",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Colour 2",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Colour 3",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Sleeve Edge",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Round Neck",
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

export const DEFAULT_BAG_CONFIG: ProductConfig = {
  product: {
    productName: "Custom Bag",
    productType: "bag",
  },
  materials: [
    {
      layerName: "Bag",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Zip",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Handle",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Piping",
      materialName: "Polyester Double Interlock (Sublimation)",
      gsm: "220-230 GSM",
      colourName: "Default",
      colourHex: "",
      colourPantone: "",
    },
    {
      layerName: "Mesh",
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
