import { Component, OnInit } from '@angular/core';
import { OrderMenu } from '../../../core/models/orderMenu';
import { OrderMenuService } from '../../../core/services/order-menu.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
declare var Swal: any;

@Component({
  selector: 'app-orders-dealer',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './orders-dealer.component.html',
  styleUrl: './orders-dealer.component.scss',
  providers: [OrderMenuService],
})
export class OrdersDealerComponent {
  orderItems: OrderMenu[] = [];
  isDetailsOpen: boolean = false; // Para controlar la visibilidad del menú desplegable
  constructor(private orderMenuService: OrderMenuService) {} // Inyectar el servicio
  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders(): void {
    this.orderMenuService.getAll().subscribe((data) => {
      // Filtrar las órdenes cuyo rol sea "completed"
      this.orderItems = data
        .filter(
          (order) =>
            order.status === 'completed' && order.tipoEntrega === 'domicilio'
        )
        .map((order) => ({
          ...order,
          isDetailsOpen: false, // Inicia en false para que los detalles estén ocultos al principio
        }));
    });
  }

  completar(order: OrderMenu): void {
    this.showConfirmPopup(
      '¿Deseas marcar esta orden como pagada?',
      'Esta orden desaparecerá de esta sección y pasará al dueño.'
    ).then((result: any) => {
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
              this.showPopup(
                'success',
                '¡Orden pagada!',
                'El pago se registró correctamente.'
              ).then((result: any) => {
                this.loadOrders(); // Recargar el menú después de eliminar el producto
              });
            }, 100);
          },
          (error) => {
            // Ocurrió un error al eliminar el producto
            this.showPopup(
              'error',
              'Ocurrió un problema.',
              'Error al pagar la orden.'
            );
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
  //POPUP
  showPopup(icon: 'success' | 'error', title: string, text: string) {
    return Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: icon === 'success' ? 'Aceptar' : 'Entendido',
      didOpen: () => {
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
  //CONFIRM POPUP
  showConfirmPopup(title: string, text: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
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
    });
  }
}
