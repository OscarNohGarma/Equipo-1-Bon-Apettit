import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuProduct } from '../../core/models/menuProduct';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private productosEnOrdenSubject = new BehaviorSubject<MenuProduct[]>([]);
  productosEnOrden$ = this.productosEnOrdenSubject.asObservable();

  agregarProducto(producto: MenuProduct) {
    const productosActuales = this.productosEnOrdenSubject.getValue();
    this.productosEnOrdenSubject.next([...productosActuales, producto]);
  }

  eliminarProducto(index: number) {
    const productosActuales = this.productosEnOrdenSubject.getValue();
    productosActuales.splice(index, 1);
    this.productosEnOrdenSubject.next([...productosActuales]);
  }

  getTotal(): number {
    return this.productosEnOrdenSubject
      .getValue()
      .reduce((acc, producto) => acc + producto.price, 0);
  }
}
