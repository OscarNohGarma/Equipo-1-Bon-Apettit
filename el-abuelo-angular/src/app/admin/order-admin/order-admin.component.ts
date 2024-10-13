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
  orderItems: OrderMenu[] = [];
  constructor(
    private orderMenuService: OrderMenuService,
    private router: Router
  ) {} // Inyectar el servicio
  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders(): void {
    this.orderMenuService.getOrden().subscribe((data) => {
      this.orderItems = data;
      console.log(this.orderItems);
    });
  }
}
