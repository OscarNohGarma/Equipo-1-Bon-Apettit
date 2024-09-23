import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-carrusel-cliente',
  standalone: true,
  imports: [CommonModule], // Agregar CommonModule aquí
  templateUrl: './carrusel-cliente.component.html',
  styleUrl: './carrusel-cliente.component.scss'
})
export class CarruselClienteComponent {
    // Arreglos de imágenes para los dos carruseles
    carrusel1 = [
      '../../../assets/imgCarruselCliente/f1.jpg',
      '../../../assets/imgCarruselCliente/f2.jpg',
      '../../../assets/imgCarruselCliente/f3.jpg',
      '../../../assets/imgCarruselCliente/f4.jpg'
    ];
    carrusel2 = [
      '../../../assets/imgCarruselCliente/f5.jpg',
      '../../../assets/imgCarruselCliente/f6.jpg',
      '../../../assets/imgCarruselCliente/f7.jpg',
      '../../../assets/imgCarruselCliente/f8.jpg'
    ];

}
