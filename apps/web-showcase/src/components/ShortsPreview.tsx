"use client";

import type { MaterialLayer } from "@configurator/core";
import Layer from "./Layer";

interface Props {
  materials: MaterialLayer[];
}

export const SHORTS_LAYER_PRESETS: {
  clipPath: string;
  order: string[];
  images: Record<string, string>;
} = {
  clipPath: "/products/shorts/01-Body.png",
  order: ["Body", "Detail", "ZK Logo"],
  images: {
    "Body": "/products/shorts/01-Body.png",
    "Detail": "/products/shorts/02-Detail.png",
    "ZK Logo": "/products/shorts/03-ZK-Logo.png",
  },
};

export default function ShortsPreview({ materials }: Props) {
  const preset = SHORTS_LAYER_PRESETS;
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

        return <Layer key={name} src={src} color={color} blendMode="multiply" />;
      })}
    </div>
  );
}
