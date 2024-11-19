import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderMenu } from '../../core/models/orderMenu';
import { OrderMenuService } from '../../core/services/order-menu.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

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
      console.log('Evento recibido desde el servidor:', data);
      // Aquí puedes mostrar una notificación o hacer lo que necesites
      this.showNotification(data.message, data.user);
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
  private showNotification(message: string, user: string): void {
    // Muestra la notificación o mensaje al usuario, por ejemplo:
    console.log(user);
    console.log(this.currentUser);

    if (user === this.currentUser) {
      alert(message); // Reemplaza con tu propia lógica de notificación
    }
    this.router.navigate(['/tus-ordenes']).then(() => {
      // Esperar a que la navegación esté completa antes de desplazar
      // window.scrollTo(0, 0); // Desplazarse al principio de la página
      window.location.reload();
    });
  }
}
