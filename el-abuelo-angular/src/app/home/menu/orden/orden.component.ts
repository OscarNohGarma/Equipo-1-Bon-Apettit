import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MenuProduct } from '../../../core/models/menuProduct';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderMenu } from '../../../core/models/orderMenu';
import { OrderMenuService } from '../../../core/services/order-menu.service';

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss'],
  providers: [OrderMenuService],
})
export class OrdenComponent implements OnInit {
  productosEnOrden: MenuProduct[] = [];
  isVisible = false; // Controla la visibilidad de la lista de productos
  buttonIsVisible = false; // Controla la visibilidad del botón para mostrar/ocultar la lista
  modalVisible = false; // Controla la visibilidad del modal
  clienteNombre = ''; // Almacena el nombre del cliente

  constructor(
    public ordenService: OrderService,
    private router: Router,
    public ordenMenuService: OrderMenuService
  ) {}

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

      // Obtener la fecha en formato YYYY-MM-DD
      const fechaActual = new Date();

      // Obtener la fecha en formato YYYY-MM-DD
      const fecha = fechaActual.toLocaleDateString('es-ES'); // Formato: 12/10/2024

      // Usar toLocaleString para obtener la hora en formato de 12 horas con a.m./p.m.
      const hora = fechaActual.toLocaleString('es-ES', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });

      const newOrden = {
        id: 0,
        namee: this.clienteNombre,
        total: this.total,
        productos: this.productosEnOrden,
        fecha, // Fecha separada
        hora, // Hora separada
      };
      console.log(`Pedido confirmado para: ${this.clienteNombre}`);
      console.log(newOrden);

      //
      this.ordenMenuService.add(newOrden).subscribe(
        (response) => {
          //! console.log('Producto añadido exitosamente:', response);

          alert('La orden se ha añadido correctamente.');
        },
        (error) => {
          console.error('Error al agregar la orden:', error);
        }
      );
      //

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
