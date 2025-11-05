import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal';
import { LayerPropertiesComponent } from '../layer-properties/layer-properties';
import { TextToolPanelComponent } from '../text-tool-panel/text-tool-panel';
import { EraserToolPanelComponent } from '../eraser-tool-panel/eraser-tool-panel';
import { MoveToolPanelComponent } from '../move-tool-panel/move-tool-panel';
import { LayerService } from '../../services/layer.service';
import { CanvasService } from '../../services/canvas.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, WelcomeModalComponent, LayerPropertiesComponent, TextToolPanelComponent, EraserToolPanelComponent, MoveToolPanelComponent],
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('selectionCanvas') selectionCanvasRef!: ElementRef<HTMLCanvasElement>;

  layerService = inject(LayerService);
  canvasService = inject(CanvasService);
  selectionService = inject(SelectionService);
  showWelcomeModal = true;

  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private selectionCtx!: CanvasRenderingContext2D;
  private lineDashOffset = 0;

  ngAfterViewInit() {
    this.canvasService.setCanvas(this.canvasRef.nativeElement);
    const selectionCanvas = this.selectionCanvasRef.nativeElement;
    this.selectionCtx = selectionCanvas.getContext('2d')!;

    // Match canvas sizes
    selectionCanvas.width = this.canvasRef.nativeElement.width;
    selectionCanvas.height = this.canvasRef.nativeElement.height;

    this.animateMarchingAnts();
  }

  animateMarchingAnts() {
    this.lineDashOffset = (this.lineDashOffset - 1) % 10;
    this.selectionCtx.clearRect(0, 0, this.selectionCtx.canvas.width, this.selectionCtx.canvas.height);

    const selection = this.selectionService.selection();
    if (selection) {
      this.selectionCtx.setLineDash([5, 5]);
      this.selectionCtx.lineDashOffset = this.lineDashOffset;
      this.selectionCtx.strokeStyle = 'white';
      this.selectionCtx.strokeRect(selection.x, selection.y, selection.width, selection.height);
    }

    requestAnimationFrame(this.animateMarchingAnts.bind(this));
  }

  onCanvasMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
  }

  onCanvasMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const currentX = event.offsetX;
    const currentY = event.offsetY;
    const width = currentX - this.startX;
    const height = currentY - this.startY;
    this.selectionService.setSelection({ x: this.startX, y: this.startY, width, height });
  }

  onCanvasMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  onNewProjectFromFile() {
    this.showWelcomeModal = false;
    // In a real app, this would come from a file input
    const sampleImageUrl = 'https://i.imgur.com/3nLdO3j.png';
    this.canvasService.loadImageOnCanvas(sampleImageUrl).then(() => {
      console.log('Image loaded on canvas');
      // For demonstration, let's inpaint a sample area after loading
      this.inpaintSampleArea();
    });
  }

  inpaintSampleArea() {
    if (this.canvasService.isCvReady()) {
      // Placeholder rectangle for inpainting
      const rect = { x: 50, y: 50, width: 200, height: 100 };
      this.canvasService.inpaint(rect);
      console.log('Inpainting performed on sample area.');
    } else {
      console.log('OpenCV not ready, skipping inpainting demo.');
    }
  }
}