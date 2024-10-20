import { Component, OnInit } from '@angular/core';
import { OrderMenu } from '../../core/models/orderMenu';
import { OrderMenuService } from '../../core/services/order-menu.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './order-admin.component.html',
  styleUrl: './order-admin.component.scss',
  providers: [OrderMenuService],
})
export class OrderAdminComponent implements OnInit {
  selectedStatus: string = 'queue'; // Estado por defecto (gris)
  orderItems: OrderMenu[] = [];
  isDetailsOpen: boolean = false; // Para controlar la visibilidad del menú desplegable
  currentStatus: string = 'queue'; // Para controlar la visibilidad del menú desplegable

  constructor(
    private orderMenuService: OrderMenuService,
    private router: Router
  ) {} // Inyectar el servicio
  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders(): void {
    this.orderMenuService.getAll().subscribe((data) => {
      // Añadir la propiedad `isDetailsOpen` a cada orden
      this.orderItems = data.map((order) => ({
        ...order,
        isDetailsOpen: false, // Inicia en false para que los detalles estén ocultos al principio
      }));
    });
  }
  completar(id: number): void {
    const confirmed = window.confirm(
      '¿Deseas marcar como completado la orden?'
    );
    if (confirmed) {
      this.orderMenuService.delete(id.toString()).subscribe(
        (response) => {
          // console.log('Producto eliminado:', response);
          // Aquí puedes agregar lógica para actualizar la vista
          setTimeout(() => {
            alert('Orden completada correctamente.');
            this.loadOrders();
          }, 500);
        },
        (error) => {
          console.error('Error al completar la orden', error);
        }
      );
    }
  }
  toggleDetails(order: OrderMenu): void {
    order.isDetailsOpen = !order.isDetailsOpen; // Alternar el estado de visibilidad de los detalles para esa orden
  }

  setStatus(status: string, order: OrderMenu) {
    this.selectedStatus = status;
    order.status = status;
    const newOrder = {
      ...order,
      status: this.selectedStatus,
    };
    this.orderMenuService.update(order.id.toString(), newOrder).subscribe(
      (response) => {
        //! console.log('Producto actualizado exitosamente:', response);
        // Aquí puedes redirigir o mostrar un mensaje de éxito
      },
      (error) => {
        console.error('Error al actualizar la orden:', error);
        // Manejo de errores aquí
      }
    );
  }
}
