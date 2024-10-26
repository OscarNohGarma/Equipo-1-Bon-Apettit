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
  constructor(
    private orderMenuService: OrderMenuService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.currentUser = this.authService.getUser()!;
    this.orderMenuService.getAll().subscribe((data) => {
      this.orderItems = data.filter((order) => order.user === this.currentUser);
    });
  }
}
