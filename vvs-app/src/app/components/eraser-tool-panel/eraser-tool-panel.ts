import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-eraser-tool-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eraser-tool-panel.html',
  styleUrls: ['./eraser-tool-panel.css']
})
export class EraserToolPanelComponent {
  canvasService = inject(CanvasService);
  isErasing = false;

  eraseSelection() {
    // In a real app, this would come from a selection tool
    const selectionRect = { x: 150, y: 150, width: 200, height: 100 };

    this.isErasing = true;

    // The inpaint function is synchronous for this simple implementation
    this.canvasService.inpaint(selectionRect);

    // A more complex implementation might be async
    setTimeout(() => {
      this.isErasing = false;
    }, 200);
  }
}