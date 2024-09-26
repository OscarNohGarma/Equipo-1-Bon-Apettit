import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MenuProduct } from '../../../core/models/menuProduct';

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss'],
})
export class OrdenComponent implements OnInit {
  productosEnOrden: MenuProduct[] = []; // Sigue usando MenuProduct

  constructor(public ordenService: OrderService) {}

  ngOnInit() {
    this.ordenService.productosEnOrden$.subscribe(
      (productos: MenuProduct[]) => {
        this.productosEnOrden = productos;
        console.log(this.productosEnOrden);
      }
    );
  }

  get total(): number {
    return this.ordenService.getTotal();
  }
}
