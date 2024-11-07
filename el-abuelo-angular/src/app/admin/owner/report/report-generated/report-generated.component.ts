import { Component } from '@angular/core';
import { OrderMenu } from '../../../../core/models/orderMenu';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
interface CantidadPorProducto {
  nombre: string;
  cantidad: number;
  total: number;
}

declare const history: any;
@Component({
  selector: 'app-report-generated',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-generated.component.html',
  styleUrl: './report-generated.component.scss',
})
export class ReportGeneratedComponent {
  filteredOrders: OrderMenu[] = [];
  dateFilter: string = '';

  total: number = 0;
  cantidadPorProducto: CantidadPorProducto[] = [];
  nOrdenes: number = 0;
  entregasLocal: number = 0;
  entregasDomicilio: number = 0;
  dateToday = '';
  dateOneWeekAgo = '';
  dateOneMonthAgo = '';
  constructor(private router: Router) {}

  ngOnInit() {
    this.filteredOrders = history.state.filteredOrders || [];
    this.dateFilter = history.state.dateFilter || '';
    this.calcular();

    const today = new Date(); // Fecha actual
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    console.log(oneWeekAgo);
    console.log(oneMonthAgo);

    this.dateToday = `${
      Number(today.getDate()) < 10 ? '0' : ''
    }${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    this.dateOneWeekAgo = `${
      Number(oneWeekAgo.getDate()) < 10 ? '0' : ''
    }${oneWeekAgo.getDate()}/${
      oneWeekAgo.getMonth() + 1
    }/${oneWeekAgo.getFullYear()}`;

    this.dateOneMonthAgo = `${
      Number(oneMonthAgo.getDate()) < 10 ? '0' : ''
    }${oneMonthAgo.getDate()}/${
      oneMonthAgo.getMonth() + 1
    }/${oneMonthAgo.getFullYear()}`;

    console.log(this.dateToday);
    console.log(this.dateOneWeekAgo);
    console.log(this.dateOneMonthAgo);
  }

  calcular() {
    this.filteredOrders.forEach((order) => {
      this.total += order.total;
      this.nOrdenes++;
      if (order.tipoEntrega == 'local') {
        this.entregasLocal++;
      } else if ((order.tipoEntrega = 'domicilio')) {
        this.entregasDomicilio++;
      }
      order.productos.forEach((pProducto) => {
        // Buscar si el producto ya existe en cantidadPorProducto
        const productoExistente = this.cantidadPorProducto.find(
          (p) => p.nombre === pProducto.namee
        );

        if (productoExistente) {
          // Si el producto ya existe, incrementa la cantidad
          productoExistente.cantidad++;

          // Buscar el precio del producto en la orden
          const precioProducto = pProducto.precio;

          // Actualiza el total del producto
          productoExistente.total = productoExistente.cantidad * precioProducto;
        } else {
          // Si no existe, agrega el producto con cantidad 1 y calcula el total
          const precioProducto = pProducto.precio;

          this.cantidadPorProducto.push({
            nombre: pProducto.namee,
            cantidad: 1,
            total: precioProducto, // Total inicial = cantidad (1) * precio
          });
        }
      });
    });
    console.log(this.cantidadPorProducto);
    console.log(this.total);
    console.log(this.nOrdenes);
    console.log(this.entregasLocal);
    console.log(this.entregasDomicilio);
  }
}
