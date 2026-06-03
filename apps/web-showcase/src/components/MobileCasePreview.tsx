"use client";

import type { MaterialLayer } from "@configurator/core";
import Layer from "./Layer";

interface Props {
  materials: MaterialLayer[];
  activeView: "back" | "front";
  pattern?: string;
  patternColor?: string;
}

const FRAME_SIDE = "/products/phone-cover/mobile-frame-side.png";
const BLACK_SCREEN = "/products/phone-cover/black-screen.png";
const BACK_COLOR = "/products/phone-cover/back-full-color.png";
const CAMERA_BOX = "/products/phone-cover/back-camera-box.png";
const CAMERA = "/products/phone-cover/back-camera.png";

function getPatternStyle(pattern: string, color: string): { css: string; size: string } {
  const toRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  switch (pattern) {
    case "none":
      return { css: "", size: "" };
    case "lines":
      return {
        css: `repeating-linear-gradient(0deg, transparent, transparent 8px, ${toRgba(color, 0.25)} 8px, ${toRgba(color, 0.25)} 10px)`,
        size: "",
      };
    case "dots":
      return {
        css: `radial-gradient(circle, ${toRgba(color, 0.3)} 1.5px, transparent 1.5px)`,
        size: "16px 16px",
      };
    case "waves":
      const encoded = `<svg width='40' height='20' xmlns='http://www.w3.org/2000/svg'><path d='M0 10 Q10 0 20 10 Q30 20 40 10' stroke='${encodeURIComponent(toRgba(color, 0.2))}' stroke-width='2' fill='none'/></svg>`;
      return {
        css: `url("data:image/svg+xml,${encoded}")`,
        size: "40px 20px",
      };
    default:
      return { css: "", size: "" };
  }
}

export default function MobileCasePreview({ materials, activeView, pattern, patternColor }: Props) {
  const matMap = new Map(materials.map((m) => [m.layerName, m]));

  const getColor = (layerName: string) => matMap.get(layerName)?.colourHex || "";

  if (activeView === "back") {
    const backColor = getColor("Back Color");
    const cameraBoxColor = getColor("Camera Box");
    const pat = getPatternStyle(pattern || "none", patternColor || "#000000");

    return (
      <div className="relative w-[320px] h-[550px]">
        {backColor ? (
          <Layer src={BACK_COLOR} color={backColor} />
        ) : (
          <img
            src={BACK_COLOR}
            alt="Back color"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        )}

        {pattern && pattern !== "none" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: pat.css,
              backgroundSize: pat.size || undefined,
              maskImage: `url(${BACK_COLOR})`,
              WebkitMaskImage: `url(${BACK_COLOR})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
        )}

        {cameraBoxColor ? (
          <Layer src={CAMERA_BOX} color={cameraBoxColor} />
        ) : (
          <img
            src={CAMERA_BOX}
            alt="Camera box"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        )}
        <img
          src={CAMERA}
          alt="Camera"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      </div>
    );
  }

  const backColor = getColor("Back Color");

  return (
    <div className="relative w-[320px] h-[550px]">
      {backColor ? (
        <Layer src={FRAME_SIDE} color={backColor} />
      ) : (
        <img
          src={FRAME_SIDE}
          alt="Frame side"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}
      <img
        src={BLACK_SCREEN}
        alt="Black screen"
        className="absolute inset-0 h-full object-contain pointer-events-none w-[82%] mx-auto "
      />
    </div>
  );
}
