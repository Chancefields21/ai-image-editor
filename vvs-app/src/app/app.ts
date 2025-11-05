import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './components/toolbar/toolbar';
import { RightPanel } from './components/right-panel/right-panel';
import { TopBar } from './components/top-bar/top-bar';
import { BottomBar } from './components/bottom-bar/bottom-bar';
import { WelcomeScreen } from './components/welcome-screen/welcome-screen';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Toolbar, RightPanel, TopBar, BottomBar, WelcomeScreen],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public readonly title = signal('vvs-app');
  welcomeVisible = signal(true);
}
