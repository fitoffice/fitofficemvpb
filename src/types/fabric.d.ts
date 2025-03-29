declare namespace fabric {
  interface IObjectOptions {
    cornerSize?: number;
    cornerColor?: string;
    cornerStrokeColor?: string;
    transparentCorners?: boolean;
    borderColor?: string;
    borderScaleFactor?: number;
    selectable?: boolean;
    hasControls?: boolean;
    hasBorders?: boolean;
    lockMovementX?: boolean;
    lockMovementY?: boolean;
    lockRotation?: boolean;
    lockScalingX?: boolean;
    lockScalingY?: boolean;
    left?: number;
    top?: number;
  }

  interface ICanvasOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
    selection?: boolean;
    preserveObjectStacking?: boolean;
  }

  class Canvas {
    constructor(element: HTMLCanvasElement | string, options?: ICanvasOptions);
    add(object: any): Canvas;
    remove(object: any): Canvas;
    clear(): Canvas;
    renderAll(): void;
    setActiveObject(object: any): Canvas;
    getActiveObject(): any;
    dispose(): void;
    width: number;
    height: number;
  }

  class Image {
    static fromURL(url: string, callback: (image: Image) => void, options?: IObjectOptions): void;
    scale(value: number): Image;
    set(options: IObjectOptions): Image;
    width: number;
    height: number;
  }
}
