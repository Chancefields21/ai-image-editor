import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './components/editor/editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EditorComponent],
  template: '<app-editor></app-editor>',
  styles: []
})
export class App {}
