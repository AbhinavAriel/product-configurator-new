"use client";

import { useEffect, useRef } from "react";
import { ConfiguratorEngine } from "@configurator/core";

type Props = {
  onEngineReady?: (engine: ConfiguratorEngine) => void;
};

export default function ConfiguratorViewer({
  onEngineReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onEngineReadyRef = useRef(onEngineReady);
  onEngineReadyRef.current = onEngineReady;

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new ConfiguratorEngine(
      containerRef.current
    );

    onEngineReadyRef.current?.(engine);

    return () => {
      engine.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}