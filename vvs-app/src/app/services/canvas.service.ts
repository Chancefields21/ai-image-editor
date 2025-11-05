import { Injectable, signal, inject, effect } from '@angular/core';
import { LayerService } from './layer.service';

// This lets TypeScript know that 'cv' is a global variable from the OpenCV.js script
declare var cv: any;

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private mainCanvas: HTMLCanvasElement | null = null;
  private mainContext: CanvasRenderingContext2D | null = null;
  private renderQueued = false;

  public readonly isCvReady = signal(false);
  private layerService = inject(LayerService);

  constructor() {
    this.checkCvReady();
    // Re-render whenever layers change
    effect(() => {
      // By reading the signal here, this effect will re-run whenever it changes.
      this.layerService.layers();
      this.requestRender();
    });
  }

  private checkCvReady() {
    if (typeof cv !== 'undefined' && cv.onRuntimeInitialized) {
      cv.onRuntimeInitialized = () => {
        this.isCvReady.set(true);
        console.log('OpenCV.js is ready.');
      };
    } else {
      // If cv is already loaded (e.g., on fast connections)
      setTimeout(() => {
        if (typeof cv !== 'undefined') {
          this.isCvReady.set(true);
          console.log('OpenCV.js was already ready.');
        }
      }, 500);
    }
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.mainCanvas = canvas;
    this.mainContext = canvas.getContext('2d');
  }

  loadImageOnCanvas(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.mainContext || !this.mainCanvas) {
        return reject('Canvas not initialized.');
      }
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        this.mainCanvas!.width = img.width;
        this.mainCanvas!.height = img.height;
        this.mainContext!.drawImage(img, 0, 0);
        resolve();
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  /**
   * Performs inpainting on a selected area of the canvas.
   * @param selectionRect The rectangle defining the area to inpaint.
   */
  inpaint(selectionRect: { x: number, y: number, width: number, height: number }): void {
    if (!this.isCvReady() || !this.mainContext || !this.mainCanvas) {
      console.error('OpenCV or canvas not ready.');
      return;
    }

    try {
      // 1. Get the image data from the canvas
      let src = cv.imread(this.mainCanvas);

      // 2. Create a mask: a black image with a white rectangle at the selection
      let mask = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
      let rect = new cv.Rect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);
      let white = new cv.Scalar(255);
      cv.rectangle(mask, rect, white, -1);

      // 3. Perform inpainting
      let dst = new cv.Mat();
      // cv.INPAINT_TELEA is generally better for removing objects
      cv.inpaint(src, mask, dst, 3, cv.INPAINT_TELEA);

      // 4. Draw the inpainted result back onto the canvas
      cv.imshow(this.mainCanvas, dst);

      // 5. Clean up memory
      src.delete();
      mask.delete();
      dst.delete();
    } catch (err) {
      console.error('OpenCV inpainting error:', err);
    }
  }

  getImageDataFromSelection(rect: { x: number, y: number, width: number, height: number }): string | null {
    if (!this.mainContext || !this.mainCanvas) return null;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rect.width;
    tempCanvas.height = rect.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return null;

    tempCtx.drawImage(this.mainCanvas, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    return tempCanvas.toDataURL();
  }

  requestRender() {
    if (!this.renderQueued) {
      this.renderQueued = true;
      requestAnimationFrame(() => {
        this.render();
        this.renderQueued = false;
      });
    }
  }

  private render() {
    if (!this.mainContext || !this.mainCanvas) return;

    // Clear the main canvas
    this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

    // Draw layers in reverse order (bottom to top)
    const layers = this.layerService.layers();
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      if (layer.isVisible && layer.content) {
        this.mainContext.globalAlpha = layer.opacity / 100;
        this.mainContext.drawImage(layer.content, layer.position.x, layer.position.y);
      }
    }
    // Reset alpha
    this.mainContext.globalAlpha = 1.0;
  }
}