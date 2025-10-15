import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal';
import { LayerPropertiesComponent } from '../layer-properties/layer-properties';
import { TextToolPanelComponent } from '../text-tool-panel/text-tool-panel';
import { EraserToolPanelComponent } from '../eraser-tool-panel/eraser-tool-panel';
import { LayerService } from '../../services/layer.service';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, WelcomeModalComponent, LayerPropertiesComponent, TextToolPanelComponent, EraserToolPanelComponent],
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  layerService = inject(LayerService);
  canvasService = inject(CanvasService);
  showWelcomeModal = true;

  ngAfterViewInit() {
    this.canvasService.setCanvas(this.canvasRef.nativeElement);
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