import { Injectable, signal } from '@angular/core';

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private readonly _selection = signal<SelectionRect | null>(null);
  public readonly selection = this._selection.asReadonly();

  setSelection(rect: SelectionRect | null) {
    this._selection.set(rect);
  }

  clearSelection() {
    this._selection.set(null);
  }
}