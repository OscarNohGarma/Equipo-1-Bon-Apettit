import { Component, OnInit } from '@angular/core';
import { OrderMenu } from '../../core/models/orderMenu';
import { OrderMenuService } from '../../core/services/order-menu.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

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
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.currentUser = this.authService.getUser()!;
    this.orderMenuService.getAll().subscribe((data) => {
      this.orderItems = data
        .filter((order) => order.user === this.currentUser)
        .reverse();
    });
  }
  updateStatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.statusFilter = selectElement.value;
    console.log(this.orderItems);
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
}
