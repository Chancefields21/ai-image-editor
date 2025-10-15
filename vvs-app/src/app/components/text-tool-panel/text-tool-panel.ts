import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextLayerService, TextProperties } from '../../services/text-layer.service';
import { Layer } from '../../models/layer.model';
import { GeminiService } from '../../services/gemini.service';
import { CanvasService } from '../../services/canvas.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-text-tool-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-tool-panel.html',
  styleUrls: ['./text-tool-panel.css']
})
export class TextToolPanelComponent {
  textLayerService = inject(TextLayerService);
  geminiService = inject(GeminiService);
  canvasService = inject(CanvasService);
  selectionService = inject(SelectionService);
  selection = this.selectionService.selection;

  activeTextLayer = signal<Layer | null>(null);

  textContent = 'Hello World';
  fontSize = 48;
  fontColor = '#000000';
  positionX = 100;
  positionY = 100;
  isAnalyzing = false;
  fontFamily = 'Arial';
  isBold = false;
  isItalic = false;

  recognizeText() {
    const selectionRect = this.selection();
    if (!selectionRect) return;

    const imageDataUrl = this.canvasService.getImageDataFromSelection(selectionRect);
    if (!imageDataUrl) return;

    this.isAnalyzing = true;
    this.geminiService.performOcr(imageDataUrl).then(text => {
      this.textContent = text;
      // Now, recognize the style
      this.recognizeTextStyle(imageDataUrl);
    }).catch(err => {
      console.error(err);
      this.isAnalyzing = false;
    });
  }

  recognizeTextStyle(imageDataUrl: string) {
    this.geminiService.describeFontStyle(imageDataUrl).then(styleDescription => {
      // Simple parsing logic
      this.isBold = styleDescription.toLowerCase().includes('bold');
      this.isItalic = styleDescription.toLowerCase().includes('italic');
      if (styleDescription.toLowerCase().includes('serif')) {
        this.fontFamily = 'serif';
      } else {
        this.fontFamily = 'sans-serif';
      }

      if (this.activeTextLayer()) {
        this.updateText();
      } else {
        this.createNewTextLayer();
      }
    }).finally(() => {
      this.isAnalyzing = false;
    });
  }

  createNewTextLayer() {
    const properties: TextProperties = {
      content: this.textContent,
      font: this.fontFamily,
      size: this.fontSize,
      color: this.fontColor,
      position: { x: this.positionX, y: this.positionY },
      isBold: this.isBold,
      isItalic: this.isItalic
    };
    const newLayer = this.textLayerService.createTextLayer(properties);
    this.activeTextLayer.set(newLayer);
  }

  updateText() {
    const layer = this.activeTextLayer();
    if (!layer) return;

    layer.position.x = this.positionX;
    layer.position.y = this.positionY;

    this.textLayerService.updateTextLayer(layer, {
      content: this.textContent,
      size: this.fontSize,
      color: this.fontColor,
      font: this.fontFamily,
      isBold: this.isBold,
      isItalic: this.isItalic,
    });
  }
}