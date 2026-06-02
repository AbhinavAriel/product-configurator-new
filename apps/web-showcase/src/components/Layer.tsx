interface LayerProps {
  src: string;
  color: string;
}

export default function Layer({
  src,
  color,
}: LayerProps) {
  return (
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
  );
}