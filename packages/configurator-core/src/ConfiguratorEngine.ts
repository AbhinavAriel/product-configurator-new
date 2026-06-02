import { Canvas, Textbox, FabricImage } from "fabric";

export class ConfiguratorEngine {
  private canvas: Canvas;
  private container: HTMLElement;
  private canvasElement: HTMLCanvasElement;
  private backgroundImage: FabricImage | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(container: HTMLElement) {
    this.container = container;

    const existingCanvas = this.container.querySelector("#product-fabric-canvas");
    if (existingCanvas) {
      existingCanvas.remove();
    }

    this.canvasElement = document.createElement("canvas");
    this.canvasElement.id = "product-fabric-canvas";
    this.canvasElement.style.width = "100%";
    this.canvasElement.style.height = "100%";
    this.canvasElement.style.display = "block";
    this.container.appendChild(this.canvasElement);

    const rect = this.container.getBoundingClientRect();
    const width = rect.width || 500;
    const height = rect.height || 700;

    this.canvas = new Canvas(this.canvasElement, {
      width: width,
      height: height,
      backgroundColor: "transparent",
      preserveObjectStacking: true,
    });

    this.canvasElement.style.width = "100%";
    this.canvasElement.style.height = "100%";

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    this.canvas.renderAll();
    this.handleResize();
  }

  private handleResize = () => {
    if (!this.canvas || !this.container) return;

    const rect = this.container.getBoundingClientRect();
    const width = rect.width || 500;
    const height = rect.height || 700;

    this.canvas.setDimensions(
      { width: Math.round(width), height: Math.round(height) },
      { backstoreOnly: true }
    );

    this.canvas.renderAll();
  };

  public addText(text: string, options: any = {}) {
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();

    const textObject = new Textbox(text, {
      left: canvasWidth / 2 - 100,
      top: canvasHeight / 2 - 25,
      width: 200,
      fontFamily: options.fontFamily || "Outfit",
      fontSize: options.fontSize || 32,
      fill: options.fill || "#000000",
      textAlign: options.textAlign || "center",
      fontWeight: options.fontWeight || "normal",
      fontStyle: options.fontStyle || "normal",
      cornerColor: "#6366f1",
      cornerStrokeColor: "#ffffff",
      cornerStyle: "circle",
      transparentCorners: false,
      cornerSize: 10,
      borderColor: "#6366f1",
      borderScaleFactor: 2,
    });

    this.canvas.add(textObject);
    this.canvas.setActiveObject(textObject);
    this.canvas.renderAll();
  }

  public updateSelectedText(options: any) {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject instanceof Textbox) {
      activeObject.set(options);
      this.canvas.renderAll();
    }
  }

  public async addSticker(url: string, options: any = {}) {
    try {
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();

      const img = await FabricImage.fromURL(url, {
        crossOrigin: "anonymous",
      });

      const targetWidth = options.width || 120;
      const scale = targetWidth / img.width;

      img.set({
        left: canvasWidth / 2 - (img.width * scale) / 2,
        top: canvasHeight / 2 - (img.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        cornerColor: "#6366f1",
        cornerStrokeColor: "#ffffff",
        cornerStyle: "circle",
        transparentCorners: false,
        cornerSize: 10,
        borderColor: "#6366f1",
        borderScaleFactor: 2,
        ...options,
      });

      this.canvas.add(img);
      this.canvas.setActiveObject(img);
      this.canvas.renderAll();
    } catch (error) {
      console.error("Failed to load sticker:", error);
    }
  }

  public async addImage(url: string) {
    await this.addSticker(url, { width: 160 });
  }

  public deleteSelected() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    this.canvas.remove(activeObject);
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  public bringToFront() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.bringObjectToFront(activeObject);
      this.canvas.renderAll();
    }
  }

  public sendToBack() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.sendObjectToBack(activeObject);
      if (this.backgroundImage) {
        this.canvas.sendObjectToBack(this.backgroundImage);
      }
      this.canvas.renderAll();
    }
  }

  public duplicateSelected() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone().then((cloned) => {
      cloned.set({
        left: (activeObject.left || 0) + 20,
        top: (activeObject.top || 0) + 20,
      });
      this.canvas.add(cloned);
      this.canvas.setActiveObject(cloned);
      this.canvas.renderAll();
    });
  }

  public async setBackgroundImage(url: string) {
    try {
      const img = await FabricImage.fromURL(url, {
        crossOrigin: "anonymous",
      });

      this.removeBackgroundImage();

      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();

      const scaleX = canvasWidth / img.width;
      const scaleY = canvasHeight / img.height;
      const scale = Math.max(scaleX, scaleY);

      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (canvasWidth - scaledWidth) / 2;
      const offsetY = (canvasHeight - scaledHeight) / 2;

      img.set({
        left: offsetX,
        top: offsetY,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
        hoverCursor: "default",
      });

      this.backgroundImage = img;

      this.canvas.add(img);
      this.canvas.sendObjectToBack(img);

      this.canvas.renderAll();
    } catch (error) {
      console.error("Failed to load background image:", error);
    }
  }

  public removeBackgroundImage() {
    if (this.backgroundImage) {
      this.canvas.remove(this.backgroundImage);
      this.backgroundImage = null;
      this.canvas.renderAll();
    }
  }

  public hasBackgroundImage(): boolean {
    return this.backgroundImage !== null;
  }

  public exportDesign(): string {
    if (!this.canvas) return "";

    const activeObject = this.canvas.getActiveObject();
    this.canvas.discardActiveObject();

    const dataUrl = this.canvas.toDataURL({
      format: "png",
      multiplier: 2,
    });

    if (activeObject) {
      this.canvas.setActiveObject(activeObject);
    }
    this.canvas.renderAll();

    return dataUrl;
  }

  public destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.canvas.dispose();
  }
}
