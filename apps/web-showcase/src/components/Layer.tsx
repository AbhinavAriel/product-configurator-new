interface LayerProps {
  src: string;
  color: string;
  blendMode?: any;
  hideOverlay?: boolean;
}

export default function Layer({ src, color, blendMode = "hard-light", hideOverlay = false }: LayerProps) {
  return (
    <div className="absolute inset-0">
      {/* Flat color mask (Base Layer) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: color,
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
      {/* Texture and lighting overlay (Top Layer) */}
      {!hideOverlay && (
        <img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ mixBlendMode: blendMode }}
        />
      )}
    </div>
  );
}