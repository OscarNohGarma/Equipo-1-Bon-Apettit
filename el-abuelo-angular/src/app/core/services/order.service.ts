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
    const itemExistente = productosActuales.find(
      (item) => item.id === producto.id
    );

    if (itemExistente) {
      // Si el producto ya está en la orden, solo aumenta la cantidad y actualiza el subtotal
      itemExistente.quantity! += 1; // Aumentar la cantidad
      itemExistente.subtotal! = itemExistente.price * itemExistente.quantity!; // Actualizar subtotal
    } else {
      // Si el producto no está en la orden, inicializa cantidad y subtotal
      producto.quantity = 1; // Inicializa la cantidad en 1
      producto.subtotal = producto.price; // Inicializa el subtotal con el precio del producto
      productosActuales.push(producto); // Agrega el nuevo producto
    }
    this.productosEnOrdenSubject.next([...productosActuales]); // Actualiza el observable
  }

  eliminarProducto(index: number) {
    const productosActuales = this.productosEnOrdenSubject.getValue();
    productosActuales.splice(index, 1);
    this.productosEnOrdenSubject.next([...productosActuales]);
  }

  getTotal(): number {
    return this.productosEnOrdenSubject
      .getValue()
      .reduce((acc, item) => acc + (item.subtotal || 0), 0); // Suma los subtotales
  }
}
