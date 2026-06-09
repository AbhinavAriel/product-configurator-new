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
    const width = Math.round(rect.width) || 500;
    const height = Math.round(rect.height) || 700;

    this.canvas.setDimensions({ width, height });
    this.canvas.renderAll();
  };

  public addText(text: string, options: any = {}) {
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();

    const { left: _l, top: _t, ...styleOptions } = options;

    const fontSize = styleOptions.fontSize || 32;
    const charWidth = fontSize * 0.6;
    const tightWidth = Math.max(text.length * charWidth + 20, 50);

    const textObject = new Textbox(text, {
      left: _l ?? canvasWidth / 2 - 100,
      top: _t ?? canvasHeight / 2 - 25,
      width: tightWidth,
      fontFamily: styleOptions.fontFamily || "Outfit",
      fontSize,
      fill: styleOptions.fill || "#000000",
      textAlign: styleOptions.textAlign || "center",
      fontWeight: styleOptions.fontWeight || "normal",
      fontStyle: styleOptions.fontStyle || "normal",
      cornerColor: "#6366f1",
      cornerStrokeColor: "#ffffff",
      cornerStyle: "circle",
      transparentCorners: false,
      cornerSize: 10,
      borderColor: "#6366f1",
      borderScaleFactor: 2,
      _textIndex: styleOptions._textIndex,
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
      this.canvas.fire("object:modified", { target: activeObject });
    }
  }

  public async addSticker(url: string, options: any = {}): Promise<FabricImage | null> {
    try {
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();

      const crossOrigin = url.startsWith("data:") ? undefined : "anonymous";
      const img = await FabricImage.fromURL(url, {
        ...(crossOrigin ? { crossOrigin } : {}),
      });

      if (!img.width || !img.height) {
        console.error("Image has zero dimensions");
        return null;
      }

      const targetWidth = options.width || 120;
      const targetHeight = options.height || (targetWidth * img.height) / img.width;
      const scaleX = targetWidth / img.width;
      const scaleY = targetHeight / img.height;

      const defaultLeft = canvasWidth / 2 - targetWidth / 2;
      const defaultTop = canvasHeight / 2 - targetHeight / 2;

      const { width: _w, height: _h, ...restOptions } = options;

      img.set({
        left: defaultLeft,
        top: defaultTop,
        scaleX,
        scaleY,
        cornerColor: "#6366f1",
        cornerStrokeColor: "#ffffff",
        cornerStyle: "circle",
        transparentCorners: false,
        cornerSize: 10,
        borderColor: "#6366f1",
        borderScaleFactor: 2,
        ...restOptions,
      });

      this.canvas.add(img);
      this.canvas.setActiveObject(img);
      this.canvas.renderAll();
      return img;
    } catch (error) {
      console.error("Failed to load sticker:", error);
      return null;
    }
  }

  public updateSelectedSticker(options: any) {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject || activeObject instanceof Textbox) return;

    if (options.scaleX !== undefined || options.scaleY !== undefined) {
      activeObject.set({
        scaleX: options.scaleX,
        scaleY: options.scaleY,
      });
    }
    if (options.left !== undefined) activeObject.set({ left: options.left });
    if (options.top !== undefined) activeObject.set({ top: options.top });
    if (options.width) {
      const naturalWidth = (activeObject as any).width;
      const currentWidth = naturalWidth * (activeObject as any).scaleX;
      if (currentWidth > 0) {
        const factor = options.width / currentWidth;
        activeObject.set({
          scaleX: (activeObject as any).scaleX * factor,
          scaleY: (activeObject as any).scaleY * factor,
        });
      }
    }
    if (options.height) {
      const naturalHeight = (activeObject as any).height;
      const currentHeight = naturalHeight * (activeObject as any).scaleY;
      if (currentHeight > 0) {
        const factor = options.height / currentHeight;
        activeObject.set({
          scaleY: (activeObject as any).scaleY * factor,
          scaleX: (activeObject as any).scaleX * factor,
        });
      }
    }

    this.canvas.renderAll();
    this.canvas.fire("object:modified", { target: activeObject });
  }

  public getActiveObjectType(): string | null {
    const obj = this.canvas.getActiveObject();
    if (!obj) return null;
    if (obj instanceof Textbox) return "textbox";
    return "image";
  }

  public getActiveObjectProperties(): Record<string, any> | null {
    const obj = this.canvas.getActiveObject();
    if (!obj) return null;
    return {
      left: obj.left,
      top: obj.top,
      type: obj.type,
      ...(obj instanceof Textbox
        ? {
            fontFamily: obj.fontFamily,
            fill: obj.fill,
            fontSize: obj.fontSize,
            fontWeight: obj.fontWeight,
            fontStyle: obj.fontStyle,
            textAlign: obj.textAlign,
          }
        : {
            width: (obj as any).width * (obj as any).scaleX,
            height: (obj as any).height * (obj as any).scaleY,
            scaleX: (obj as any).scaleX,
            scaleY: (obj as any).scaleY,
          }),
    };
  }

  public async addImage(url: string) {
    await this.addSticker(url, { width: 160 });
  }

  public clearAll() {
    const objects = this.canvas.getObjects();
    for (const obj of objects) {
      if (obj.selectable && obj.type !== "rect") {
        this.canvas.remove(obj);
      }
    }
    this.removeBackgroundImage();
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
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

  public async setClipPath(imageUrl: string) {
    try {
      const isDataUri = imageUrl.startsWith("data:");
      const img = await FabricImage.fromURL(imageUrl, {
        ...(isDataUri ? {} : { crossOrigin: "anonymous" }),
      });

      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();

      const scaleX = canvasWidth / img.width;
      const scaleY = canvasHeight / img.height;
      const scale = Math.min(scaleX, scaleY);

      const offsetX = (canvasWidth - img.width * scale) / 2;
      const offsetY = (canvasHeight - img.height * scale) / 2;

      img.set({
        left: offsetX,
        top: offsetY,
        scaleX: scale,
        scaleY: scale,
        originX: "left",
        originY: "top",
        selectable: false,
        evented: false,
        hoverCursor: "default",
      });

      this.canvas.clipPath = img;
      this.canvas.renderAll();
    } catch (error) {
      console.error("Failed to set clip path:", error);
    }
  }

  public removeClipPath() {
    (this.canvas.clipPath as any) = null;
    this.canvas.renderAll();
  }

  public getCanvasElement(): HTMLCanvasElement {
    return this.canvasElement;
  }

  public getCanvasWidth(): number {
    return this.canvas.getWidth();
  }

  public getCanvasHeight(): number {
    return this.canvas.getHeight();
  }

  public destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.canvas.dispose();
  }
}
