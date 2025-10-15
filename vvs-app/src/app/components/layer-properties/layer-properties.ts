import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerService } from '../../services/layer.service';

@Component({
  selector: 'app-layer-properties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layer-properties.html',
  styleUrls: ['./layer-properties.css']
})
export class LayerPropertiesComponent {
  layerService = inject(LayerService);
  layers = this.layerService.layers;
}