import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-welcome.component.html',
  styleUrl: './menu-welcome.component.scss',
})
export class MenuWelcomeComponent {
  carrusel1 = [
    '../../../../assets/comida4.jpg',
    '../../../../assets/comida5.jpg',
    '../../../../assets/comida2.jpg',
    // '../../../../assets/comida3.jpg',
  ];
}
