import type { MaterialLayer } from "@configurator/core";
import Layer from "./Layer";

interface Props {
  materials: MaterialLayer[];
  variant?: TshirtVariant;
}

export type TshirtVariant = "full-sleeves" | "half-sleeves" | "sleevless";

type TshirtLayerPreset = {
  clipPath: string;
  order: string[];
  images: Record<string, string>;
  materialAlias?: Record<string, string>;
  colorSource?: Record<string, string>;
};

export const TSHIRT_LAYER_PRESETS: Record<TshirtVariant, TshirtLayerPreset> = {
  "full-sleeves": {
    clipPath: "/products/tshirt/01---Body.png",
    order: [
      "Body",
      "Body Stripe",
      "Left Set Sleeve",
      "Right Set Sleeve",
      "Collar",
      "Number Panel",
      "Zapkam",
      "Zk",
    ],
    images: {
      "Body": "/products/tshirt/01---Body.png",
      "Body Stripe": "/products/tshirt/02---Body-Stripe-.png",
      "Number Panel": "/products/tshirt/03---Number-Panel.png",
      "Right Set Sleeve": "/products/tshirt/04---Right-Set-Sleeve.png",
      "Left Set Sleeve": "/products/tshirt/05---Left-Set-Sleeve.png",
      "Collar": "/products/tshirt/06---Round-Neck.png",
      "Zapkam": "/products/tshirt/07---Zapkam.png",
      "Zk": "/products/tshirt/08---ZK.png",
    },
    materialAlias: {
      "Left Set Sleeve": "Set Sleeve",
      "Right Set Sleeve": "Set Sleeve",
    },
    colorSource: {
      "Body Stripe": "Body",
      "Number Panel": "Body",
    },
  },
  "half-sleeves": {
    clipPath: "/products/tshirt/half-sleeves/01---Body.png",
    order: [
      "Body",
      "Outer Design",
      "Middle Design",
      "Set Sleeves",
      "Inner Placket",
      "Front Placket",
      "Collar",
      "Zapkam",
      "Zk",
    ],
    images: {
      "Body": "/products/tshirt/half-sleeves/01---Body.png",
      "Outer Design": "/products/tshirt/half-sleeves/02---Outer-Design.png",
      "Middle Design": "/products/tshirt/half-sleeves/03---Middle-Design.png",
      "Set Sleeves": "/products/tshirt/half-sleeves/04---Set-Sleeves.png",
      "Zapkam": "/products/tshirt/half-sleeves/05---Zapkam-Logo.png",
      "Zk": "/products/tshirt/half-sleeves/06---ZK-Logo.png",
      "Inner Placket": "/products/tshirt/half-sleeves/07---Inner-Placket.png",
      "Front Placket": "/products/tshirt/half-sleeves/08---Front-Placket.png",
      "Collar": "/products/tshirt/half-sleeves/09---Collar.png",
    },
  },
  "sleevless": {
    clipPath: "/products/tshirt/sleevless/01-Body.png",
    order: [
      "Body",
      "Colour 1",
      "Colour 2",
      "Colour 3",
      "Sleeve Edge",
      "Round Neck",
      "Zk",
    ],
    images: {
      "Body": "/products/tshirt/sleevless/01-Body.png",
      "Colour 1": "/products/tshirt/sleevless/02-colour1.png",
      "Colour 2": "/products/tshirt/sleevless/03-colour2.png",
      "Sleeve Edge": "/products/tshirt/sleevless/03-Sleeve-Edge.png",
      "Colour 3": "/products/tshirt/sleevless/04-colour3.png",
      "Round Neck": "/products/tshirt/sleevless/04-Round-Neck.png",
      "Zk": "/products/tshirt/sleevless/05-ZK-Logo.png",
    },
  },
};

export default function JerseyPreview({ materials, variant = "full-sleeves" }: Props) {
  const preset = TSHIRT_LAYER_PRESETS[variant];
  const layerMap = new Map(materials.map((m) => [m.layerName, m]));

  const sortedLayers = preset.order
    .map((name) => {
      const matKey = preset.materialAlias?.[name] || name;
      const mat = layerMap.get(matKey);
      const src = preset.images[name];
      if (!src) return null;
      return { name, mat, src };
    })
    .filter(Boolean);

  return (
    <div className="relative w-[650px] h-[433px]">
      {sortedLayers.map((item) => {
        if (!item) return null;
        const { name, mat, src } = item;

        let color = "";

        if (preset.colorSource?.[name]) {
          const sourceMat = layerMap.get(preset.colorSource[name]);
          if (sourceMat?.colourHex) {
            color = sourceMat.colourHex;
          }
        } else if (mat?.colourHex) {
          color = mat.colourHex;
        }

        if (!color) {
          return (
            <img
              key={name}
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
            />
          );
        }

        return (
          <Layer
            key={name}
            src={src}
            color={color}
          />
        );
      })}
    </div>
  );
}
