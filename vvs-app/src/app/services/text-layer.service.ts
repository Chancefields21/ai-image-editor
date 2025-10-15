import { Injectable, inject } from '@angular/core';
import { LayerService } from './layer.service';
import { Layer, LayerType } from '../models/layer.model';

export interface TextProperties {
  content: string;
  font: string;
  size: number;
  color: string;
  position: { x: number; y: number };
  isBold: boolean;
  isItalic: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TextLayerService {
  layerService = inject(LayerService);

  createTextLayer(properties: TextProperties): Layer {
    const canvas = document.createElement('canvas');
    const newLayer = this.layerService.addLayer({
      name: properties.content.substring(0, 20) || 'New Text',
      type: 'text',
      content: canvas,
    });

    newLayer.position = properties.position;

    this.updateTextLayer(newLayer, properties);
    return newLayer;
  }

  updateTextLayer(layer: Layer, properties: Partial<TextProperties>) {
    if (layer.type !== 'text' || !layer.content) {
      return;
    }

    const canvas = layer.content;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // This is a simplified approach. A real implementation would need to merge
    // existing properties with new ones and recalculate canvas size.
    const fullProps: TextProperties = {
      content: 'Hello World',
      font: 'Arial',
      size: 48,
      color: '#000000',
      position: { x: 50, y: 50 },
      isBold: false,
      isItalic: false,
      ...properties
    };

    const fontStyle = `${fullProps.isItalic ? 'italic' : ''} ${fullProps.isBold ? 'bold' : ''} ${fullProps.size}px ${fullProps.font}`;
    ctx.font = fontStyle;

    // Resize canvas to fit text
    const textMetrics = ctx.measureText(fullProps.content);
    canvas.width = textMetrics.width;
    canvas.height = fullProps.size * 1.2; // Approximate height

    // Re-apply font after resize and clear
    ctx.font = fontStyle;
    ctx.fillStyle = fullProps.color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(fullProps.content, 0, fullProps.size);

    this.layerService.updateLayer(layer);
  }
}