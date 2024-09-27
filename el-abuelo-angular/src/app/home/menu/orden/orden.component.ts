import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MenuProduct } from '../../../core/models/menuProduct';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss'],
})
export class OrdenComponent implements OnInit {
  productosEnOrden: MenuProduct[] = [];
  isVisible = false; // Controla la visibilidad de la lista de productos
  buttonIsVisible = false; // Controla la visibilidad del botón para mostrar/ocultar la lista
  modalVisible = false; // Controla la visibilidad del modal
  clienteNombre = ''; // Almacena el nombre del cliente

  constructor(public ordenService: OrderService, private router: Router) {}

  ngOnInit() {
    this.ordenService.productosEnOrden$.subscribe((productos) => {
      this.productosEnOrden = productos;
      this.isVisible = this.productosEnOrden.length > 0;
      this.buttonIsVisible = this.productosEnOrden.length > 0;
    });
  }

  toggleOrden() {
    this.isVisible = !this.isVisible;
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
    this.modalVisible = true; // Muestra el modal
  }

  cerrarModal() {
    this.modalVisible = false; // Oculta el modal
  }

  enviarPedido() {
    if (this.clienteNombre) {
      // Lógica para enviar el pedido con el nombre del cliente
      console.log(`Pedido confirmado para: ${this.clienteNombre}`);
      console.log(this.productosEnOrden);
      this.cerrarModal();
      this.isVisible = false;
      setTimeout(() => {
        this.clienteNombre = '';
        this.ordenService.eliminarTodosLosProductos();
        this.router.navigate(['/menu']).then(() => {
          // Esperar a que la navegación esté completa antes de desplazar
          window.scrollTo(0, 0); // Desplazarse al principio de la página
        });
      }, 500); // Ajusta el tiempo según lo necesites
    } else {
      alert('Por favor ingresa tu nombre.');
    }
  }
}
