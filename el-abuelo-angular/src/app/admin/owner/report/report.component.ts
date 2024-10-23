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

  completar(order: OrderMenu): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Deseas marcar esta orden como pagada?',
      text: 'Esta orden desaparecerá de esta sección y pasará al dueño.',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false, // Desactivar estilos predeterminados de SweetAlert2
      didOpen: () => {
        // Aplicar estilos directamente
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton) {
          confirmButton.style.backgroundColor = '#343a40';
          confirmButton.style.color = '#fff';
          confirmButton.style.padding = '10px 20px';
          confirmButton.style.fontWeight = 'bold';
          confirmButton.style.border = 'none';
          confirmButton.style.border = '2px solid #343a40';
          confirmButton.style.borderRadius = '5px';
          confirmButton.style.transition = 'background-color 0.3s ease'; // Agregar transición
          confirmButton.style.marginRight = '10px'; // Agregar transición

          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#24272b'; // Color en hover
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#343a40'; // Color normal
          };
        }

        if (cancelButton) {
          cancelButton.style.backgroundColor = '#fff';
          cancelButton.style.color = '#dc3545';
          cancelButton.style.padding = '10px 20px';
          cancelButton.style.fontWeight = 'bold';
          cancelButton.style.border = 'none';
          cancelButton.style.border = '2px solid #dc3545';
          cancelButton.style.borderRadius = '5px';
          cancelButton.style.transition = 'background-color 0.3s ease'; // Agregar transición

          cancelButton.onmouseover = () => {
            cancelButton.style.color = '#fff';
            cancelButton.style.backgroundColor = '#dc3545'; // Color en hover
          };
          cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = '#fff'; // Color normal
            cancelButton.style.color = '#dc3545';
          };
        }
      },
    }).then((result: any) => {
      if (result.isConfirmed) {
        // El usuario confirmó la acción

        const newOrder = {
          ...order,
          status: 'paid',
        };
        this.orderMenuService.update(order.id.toString(), newOrder).subscribe(
          (response) => {
            // El producto fue eliminado exitosamente
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: '¡Orden pagada!',
                text: 'El pago se registró correctamente.',
                confirmButtonText: 'Aceptar',
                didOpen: () => {
                  // Aplicar estilos directamente
                  const confirmButton = Swal.getConfirmButton();

                  if (confirmButton) {
                    confirmButton.style.backgroundColor = '#343a40';

                    confirmButton.onmouseover = () => {
                      confirmButton.style.backgroundColor = '#212529'; // Color en hover
                    };
                    confirmButton.onmouseout = () => {
                      confirmButton.style.backgroundColor = '#343a40'; // Color normal
                    };
                  }
                },
              }).then((result: any) => {
                this.loadOrders(); // Recargar el menú después de eliminar el producto
              });
            }, 100);
          },
          (error) => {
            // Ocurrió un error al eliminar el producto
            Swal.fire({
              icon: 'error',
              title: 'Ocurrió un problema.',
              text: 'Error al pagar la orden.',
              confirmButtonText: 'Entendido',
              didOpen: () => {
                // Aplicar estilos directamente
                const confirmButton = Swal.getConfirmButton();

                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#343a40';

                  confirmButton.onmouseover = () => {
                    confirmButton.style.backgroundColor = '#212529'; // Color en hover
                  };
                  confirmButton.onmouseout = () => {
                    confirmButton.style.backgroundColor = '#343a40'; // Color normal
                  };
                }
              },
            });
          }
        );
      }
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
}
