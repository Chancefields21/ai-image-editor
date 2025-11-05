import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasService } from '../../services/canvas.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-eraser-tool-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eraser-tool-panel.html',
  styleUrls: ['./eraser-tool-panel.css']
})
export class EraserToolPanelComponent {
  canvasService = inject(CanvasService);
  selectionService = inject(SelectionService);
  selection = this.selectionService.selection;
  isErasing = false;

  eraseSelection() {
    const selectionRect = this.selection();
    if (!selectionRect) return;

    this.isErasing = true;

    this.canvasService.inpaint(selectionRect);

    setTimeout(() => {
      this.isErasing = false;
      this.selectionService.clearSelection();
    }, 200);
  }
}