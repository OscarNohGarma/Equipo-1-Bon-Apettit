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
  statusFilter: string = ''; // Filtro de stock (activo/inactivo)
  copmpleteFilter: string = 'active'; // Filtro de stock (activo/inactivo)
  disableStatusFilter: boolean = false; // Nueva propiedad para desactivar el select
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

  get filteredOrders(): OrderMenu[] {
    return this.orderItems.filter((order) => {
      const matchesStatus =
        this.statusFilter === '' || order.status === this.statusFilter;
      const matchesComplete =
        this.copmpleteFilter === '' ||
        (this.copmpleteFilter === 'completed' &&
          order.status === 'completed') ||
        (this.copmpleteFilter === 'active' && order.status !== 'completed');

      return matchesStatus && matchesComplete;
    });
  }

  completar(order: OrderMenu): void {
    const confirmed = window.confirm(
      '¿Deseas marcar como completado la orden?'
    );
    if (confirmed) {
      const newOrder = {
        ...order,
        status: 'completed',
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
    window.location.reload();
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
  updateStatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.statusFilter = selectElement.value;
  }

  // Método para actualizar el filtro de stock
  updateComplete(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.copmpleteFilter = selectElement.value;
    if (this.copmpleteFilter === 'completed') {
      this.statusFilter = ''; // Mostrará todas las órdenes completadas, sin importar el estado
      this.disableStatusFilter = true; // Desactiva el select del filtro de estado
    } else {
      this.disableStatusFilter = false; // Activa el filtro de estado si no están completadas
    }
  }
}
