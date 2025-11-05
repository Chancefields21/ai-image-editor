import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasService } from '../../services/canvas.service';
import { SelectionService } from '../../services/selection.service';
import { LayerService } from '../../services/layer.service';

@Component({
  selector: 'app-move-tool-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './move-tool-panel.html',
  styleUrls: ['./move-tool-panel.css']
})
export class MoveToolPanelComponent {
  canvasService = inject(CanvasService);
  selectionService = inject(SelectionService);
  layerService = inject(LayerService);
  selection = this.selectionService.selection;

  grabAndMove() {
    const selectionRect = this.selection();
    if (!selectionRect) return;

    // 1. Copy selection to a new canvas (which will be our new layer's content)
    const newCanvas = document.createElement('canvas');
    newCanvas.width = selectionRect.width;
    newCanvas.height = selectionRect.height;
    const newCtx = newCanvas.getContext('2d')!;
    const imageData = this.canvasService.getImageDataFromSelection(selectionRect);
    if (imageData) {
      const img = new Image();
      img.onload = () => {
        newCtx.drawImage(img, 0, 0);

        // 2. Add this new canvas as a layer
        const newLayer = this.layerService.addLayer({
          name: 'Moved Selection',
          type: 'image',
          content: newCanvas,
        });
        newLayer.position = { x: selectionRect.x, y: selectionRect.y };
        this.layerService.updateLayer(newLayer);

        // 3. Erase the original area
        this.canvasService.inpaint(selectionRect);

        // 4. Clear the selection
        this.selectionService.clearSelection();
      };
      img.src = imageData;
    }
  }
}