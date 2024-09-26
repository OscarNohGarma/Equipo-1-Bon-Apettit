import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MenuProduct } from '../../../core/models/menuProduct';

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss'],
})
export class OrdenComponent implements OnInit {
  productosEnOrden: MenuProduct[] = [];
  isVisible: boolean = false; // Controlar la visibilidad

  constructor(public ordenService: OrderService) {}

  ngOnInit() {
    this.ordenService.productosEnOrden$.subscribe((productos) => {
      this.productosEnOrden = productos;
      if (productos.length > 0) {
        this.isVisible = true; // Mostrar cuando hay productos
      } else {
        this.isVisible = false; // Ocultar si no hay productos
      }
    });
  }

  get total(): number {
    return this.ordenService.getTotal();
  }

  incrementarCantidad(index: number): void {
    this.ordenService.incrementarCantidad(index); // Llama al servicio para incrementar
  }

  decrementarCantidad(index: number): void {
    this.ordenService.decrementarCantidad(index); // Llama al servicio para decrementar
  }
}
