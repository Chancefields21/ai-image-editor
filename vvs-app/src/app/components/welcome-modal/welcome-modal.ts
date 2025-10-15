import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-modal.html',
  styleUrls: ['./welcome-modal.css']
})
export class WelcomeModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() newFromFile = new EventEmitter<void>();

  onNewFromFile() {
    this.newFromFile.emit();
    this.close.emit();
  }
}