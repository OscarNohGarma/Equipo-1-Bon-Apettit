import { Component, OnInit } from '@angular/core';
import { OrderMenu } from '../../../core/models/orderMenu';
import { OrderMenuService } from '../../../core/services/order-menu.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

declare var Swal: any;
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  providers: [OrderMenuService],
})
export class ReportComponent {
  orderItems: OrderMenu[] = [];
  isDetailsOpen: boolean = false; // Para controlar la visibilidad del menú desplegable
  filteredOrders: OrderMenu[] = []; // Para las órdenes filtradas
  dateFilter: string = ''; //

  constructor(
    private orderMenuService: OrderMenuService,
    private router: Router
  ) {} // Inyectar el servicio
  ngOnInit(): void {
    this.dateFilter = 'hoy'; // Filtro por defecto "hoy"
    this.loadOrders();
  }
  loadOrders(): void {
    this.orderMenuService.getAll().subscribe((data) => {
      // Filtrar las órdenes cuyo rol sea "completed"
      this.orderItems = data
        .filter((order) => order.status === 'paid')
        .map((order) => ({
          ...order,
          isDetailsOpen: false, // Inicia en false para que los detalles estén ocultos al principio
        }));
      // Inicialmente, todas las órdenes se muestran

      this.updateDateFilter();
    });
  }

  toggleDetails(order: OrderMenu): void {
    order.isDetailsOpen = !order.isDetailsOpen; // Alternar el estado de visibilidad de los detalles para esa orden
  }

  deleteOrder(id: number) {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar esta orden?'
    );
    if (confirmed) {
      this.orderMenuService.delete(id.toString()).subscribe(
        (response) => {
          // console.log('Producto eliminado:', response);
          // Aquí puedes agregar lógica para actualizar la vista
          setTimeout(() => {
            alert('Orden eliminada correctamente.');
            this.loadOrders(); // Por ejemplo, recargar el menú
          }, 500);
        },
        (error) => {
          console.error('Error al eliminar la orden: ', error);
        }
      );
    }
  }

  updateDateFilter(): void {
    const today = new Date(); // Fecha actual
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // Crear un nuevo arreglo filtrado basado en las órdenes originales
    this.filteredOrders = this.orderItems.filter((order) => {
      const orderDateParts = order.fecha.split('/'); // '20/10/2024' -> ['20', '10', '2024']
      const orderDate = new Date(
        parseInt(orderDateParts[2]), // Año
        parseInt(orderDateParts[1]) - 1, // Mes
        parseInt(orderDateParts[0]) // Día
      );
      console.log(oneWeekAgo);
      console.log(oneMonthAgo);

      const year = oneMonthAgo.getFullYear();
      const month = oneMonthAgo.getMonth() + 1; // Los meses empiezan desde 0
      const day = oneMonthAgo.getDate();

      console.log(`${year}-${month}-${day}`);

      switch (this.dateFilter) {
        case 'hoy':
          return (
            orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
          );
        case 'semana':
          return orderDate >= oneWeekAgo;
        case 'mes':
          return orderDate >= oneMonthAgo;
        default:
          return true; // Mostrar todas las órdenes si no hay filtro
      }
    });
  }

  updateDate(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.dateFilter = selectElement.value;
    this.updateDateFilter(); // Llamar a la función de filtrado
  }

  navigateWithOrders() {
    this.router.navigate(['/admin/report/generado'], {
      state: {
        filteredOrders: this.filteredOrders,
        dateFilter: this.dateFilter,
      },
    });
  }
}
