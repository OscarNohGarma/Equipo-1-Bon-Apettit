import { Component, OnInit } from '@angular/core';
import { OrderMenu } from '../../core/models/orderMenu';
import { OrderMenuService } from '../../core/services/order-menu.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
declare var Swal: any;
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
    Swal.fire({
      icon: 'warning',
      title: '¿Deseas enviar esta orden?',
      text: 'Esta orden desaparecerá de esta sección y pasará al repartidor/cajero.',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
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
          status: 'completed',
        };
        this.orderMenuService.update(order.id.toString(), newOrder).subscribe(
          (response) => {
            // El producto fue eliminado exitosamente
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: '¡Orden enviada!',
                text: 'La orden se envió correctamente. Ahora el repartidor/cajero podrá verla en su lista.',
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
              text: 'Error al actualizar la orden.',
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
}
