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
  isVisible = false; // Mantener solo esta variable
  buttonIsVisible = false; // Mantener solo esta variable

  constructor(public ordenService: OrderService) {}

  ngOnInit() {
    this.ordenService.productosEnOrden$.subscribe((productos) => {
      this.productosEnOrden = productos;
      this.isVisible = this.productosEnOrden.length > 0; // Mostrar solo si hay productos
      this.buttonIsVisible = this.productosEnOrden.length > 0; // Mantener solo esta variable
    });
  }

  toggleOrden() {
    this.isVisible = !this.isVisible; // Alternar visibilidad
  }

  get total(): number {
    return this.ordenService.getTotal();
  }

  incrementarCantidad(index: number) {
    this.ordenService.incrementarCantidad(index);
  }

  decrementarCantidad(index: number) {
    this.ordenService.decrementarCantidad(index);
  }

  confirmarPedido() {
    // Lógica para confirmar el pedido
  }
}
