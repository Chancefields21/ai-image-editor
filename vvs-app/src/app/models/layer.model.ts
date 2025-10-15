export type LayerType = 'image' | 'text' | 'adjustment';

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  isVisible: boolean;
  opacity: number;
  position: { x: number; y: number };
  // Canvas or HTML element representing the layer's content
  content: HTMLCanvasElement | null;
}