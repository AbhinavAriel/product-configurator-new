import type { MaterialLayer } from "@configurator/core";
import Layer from "./Layer";

interface Props {
  materials: MaterialLayer[];
}

export const BAG_LAYER_PRESETS: {
  clipPath: string;
  order: string[];
  images: Record<string, string>;
} = {
  clipPath: "/products/bag/01-Bag.png",
  order: ["Bag", "Zip", "Handle", "Piping", "Mesh"],
  images: {
    Bag: "/products/bag/01-Bag.png",
    Zip: "/products/bag/02-Zip.png",
    Handle: "/products/bag/03-Handle.png",
    Piping: "/products/bag/04-Piping.png",
    Mesh: "/products/bag/05-Mesh.png",
  },
};

export default function BagPreview({ materials }: Props) {
  const preset = BAG_LAYER_PRESETS;
  const layerMap = new Map(materials.map((m) => [m.layerName, m]));

  const sortedLayers = preset.order
    .map((name) => {
      const mat = layerMap.get(name);
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
        const color = mat?.colourHex || "";

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

        return <Layer key={name} src={src} color={color} />;
      })}
    </div>
  );
}
