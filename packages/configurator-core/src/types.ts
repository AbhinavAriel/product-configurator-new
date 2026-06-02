export interface ConfiguratorOptions {
  container: HTMLElement;
  width?: number;
  height?: number;
}

export interface ProductConfiguration {
  productId: string;
  colors?: Record<string, string>;
  textures?: Record<string, string>;
}