import type { MaterialLayer } from "@configurator/core";
import Layer from "./Layer";

interface Props {
  materials: MaterialLayer[];
}

const LAYER_IMAGE_MAP: Record<string, { src: string; isStatic?: boolean }> = {
  "Body": { src: "/products/tshirt/01---Body.png" },
  "Body Stripe": { src: "/products/tshirt/02---Body-Stripe-.png" },
  "Number Panel": { src: "/products/tshirt/03---Number-Panel.png" },
  "Right Set Sleeve": { src: "/products/tshirt/04---Right-Set-Sleeve.png" },
  "Left Set Sleeve": { src: "/products/tshirt/05---Left-Set-Sleeve.png" },
  "Collar": { src: "/products/tshirt/06---Round-Neck.png" },
  "Zapkam": { src: "/products/tshirt/07---Zapkam.png" },
  "Zk": { src: "/products/tshirt/08---ZK.png" },
};

const LAYER_ORDER: string[] = [
  "Body",
  "Body Stripe",
  "Left Set Sleeve",
  "Right Set Sleeve",
  "Collar",
  "Number Panel",
  "Zapkam",
  "Zk",
];

const MATERIAL_ALIAS: Record<string, string> = {
  "Left Set Sleeve": "Set Sleeve",
  "Right Set Sleeve": "Set Sleeve",
};

const COLOR_SOURCE: Record<string, string> = {
  "Body Stripe": "Body",
  "Number Panel": "Body",
};

export default function JerseyPreview({ materials }: Props) {
  const layerMap = new Map(materials.map((m) => [m.layerName, m]));

  const sortedLayers = LAYER_ORDER
    .map((name) => {
      const matKey = MATERIAL_ALIAS[name] || name;
      const mat = layerMap.get(matKey);
      const img = LAYER_IMAGE_MAP[name];
      if (!img) return null;
      return { name, mat, img };
    })
    .filter(Boolean);

  return (
    <div className="relative w-[650px] h-[433px]">
      {sortedLayers.map((item) => {
        if (!item) return null;
        const { name, mat, img } = item;

        let color = "";

        if (COLOR_SOURCE[name]) {
          const sourceMat = layerMap.get(COLOR_SOURCE[name]);
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
              src={img.src}
              className="absolute inset-0 w-full h-full object-contain"
            />
          );
        }

        return (
          <Layer
            key={name}
            src={img.src}
            color={color}
          />
        );
      })}
    </div>
  );
}
