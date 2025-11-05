import { Injectable, signal } from '@angular/core';
import { Layer } from '../models/layer.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class LayerService {
  private readonly _layers = signal<Layer[]>([]);
  public readonly layers = this._layers.asReadonly();

  addLayer(layer: Omit<Layer, 'id' | 'opacity' | 'isVisible' | 'position'>): Layer {
    const newLayer: Layer = {
      ...layer,
      id: uuidv4(),
      opacity: 100,
      isVisible: true,
      position: { x: 0, y: 0 }
    };
    this._layers.update(layers => [newLayer, ...layers]);
    return newLayer;
  }

  removeLayer(id: string) {
    this._layers.update(layers => layers.filter(layer => layer.id !== id));
  }

  updateLayer(updatedLayer: Layer) {
    this._layers.update(layers =>
      layers.map(layer => layer.id === updatedLayer.id ? updatedLayer : layer)
    );
  }

  getLayerById(id: string): Layer | undefined {
    return this.layers().find(layer => layer.id === id);
  }
}