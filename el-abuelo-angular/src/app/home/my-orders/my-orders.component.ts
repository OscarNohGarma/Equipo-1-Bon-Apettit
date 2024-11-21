import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderMenu } from '../../core/models/orderMenu';
import { OrderMenuService } from '../../core/services/order-menu.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
})
export class MyOrdersComponent implements OnInit {
  orderItems: OrderMenu[] = [];
  currentUser: string = '';
  statusFilter: string = 'active'; // Filtro de stock (activo/inactivo)
  constructor(
    private orderMenuService: OrderMenuService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.currentUser = this.authService.getUser()!;
    this.orderMenuService.getAll().subscribe((data) => {
      this.orderItems = data
        .filter((order) => order.user === this.currentUser)
        .reverse();
    });
    // Escuchar el evento 'mensaje' desde el servidor
    this.notificationService.listenToEvent('orderCancelled', (data) => {
      // console.log('Evento recibido desde el servidor:', data);
      // Aquí puedes mostrar una notificación o hacer lo que necesites
      this.showCancelNotification(data.message, data.user);
    });

    this.notificationService.listenToEvent('orderCompleted', (data) => {
      // console.log('Evento recibido desde el servidor:', data);
      // Aquí puedes mostrar una notificación o hacer lo que necesites
      this.showCompleteNotification(data.message, data.user, data.entrega);
    });

    // Emitir un evento 'mensaje' al servidor
    // this.notificationService.emitEvent('mensaje', { text: 'Hola servidor' });
  }

  // ngOnDestroy(): void {
  //   this.notificationService.disconnect();
  // }
  updateStatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.statusFilter = selectElement.value;
  }
  get filteredOrders(): OrderMenu[] {
    return this.orderItems.filter((order) => {
      const matchesStatus =
        this.statusFilter === '' ||
        order.status === this.statusFilter ||
        (this.statusFilter === 'active' && order.status !== 'paid');
      return matchesStatus;
    });
  }
  private showCancelNotification(message: string, user: string): void {
    // Muestra la notificación o mensaje al usuario, por ejemplo:
    if (user === this.currentUser) {
      this.showPopup(
        'error',
        'Ordel cancelada',
        'Tu orden fue cancelada por que no hay ingredientes suficientes'
      ).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/tus-ordenes']);
          this.orderMenuService.getAll().subscribe((data) => {
            this.orderItems = data
              .filter((order) => order.user === this.currentUser)
              .reverse();
          });
        }
      });
    }
  }
  private showCompleteNotification(
    message: string,
    user: string,
    entrega: string
  ): void {
    // Muestra la notificación o mensaje al usuario, por ejemplo:
    if (user === this.currentUser) {
      this.showPopup(
        'success',
        'Orden lista para entregar',
        entrega === 'local'
          ? 'Tu orden está lista para ser recogida en el local'
          : 'Tu orden esta lista para ser entregada a domicilio'
      ).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/tus-ordenes']);
          this.orderMenuService.getAll().subscribe((data) => {
            this.orderItems = data
              .filter((order) => order.user === this.currentUser)
              .reverse();
          });
        }
      });
    }
  }
  showPopup(icon: 'success' | 'error', title: string, text: string) {
    return Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'Ver',
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
}
