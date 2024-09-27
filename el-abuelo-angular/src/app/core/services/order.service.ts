import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuProduct } from '../../core/models/menuProduct';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private productosEnOrdenSubject = new BehaviorSubject<MenuProduct[]>([]);
  productosEnOrden$ = this.productosEnOrdenSubject.asObservable();
  isVisible: boolean = false;

  agregarProducto(producto: MenuProduct) {
    const productosActuales = this.productosEnOrdenSubject.getValue();
    const itemExistente = productosActuales.find(
      (item) => item.id === producto.id
    );

    if (itemExistente) {
      // Si el producto ya está en la orden, solo aumenta la cantidad y actualiza el subtotal
      itemExistente.quantity! += 1;
      itemExistente.subtotal! = itemExistente.price * itemExistente.quantity!;
    } else {
      // Si el producto no está en la orden, inicializa cantidad y subtotal
      producto.quantity = 1;
      producto.subtotal = producto.price;
      productosActuales.push(producto);
    }

    this.productosEnOrdenSubject.next([...productosActuales]);

    // Activar visibilidad si hay productos
    if (productosActuales.length > 0) {
      this.isVisible = true;
    }
  }

  eliminarProducto(index: number) {
    const productosActuales = this.productosEnOrdenSubject.getValue();
    productosActuales.splice(index, 1);
    this.productosEnOrdenSubject.next([...productosActuales]);
  }

  // Método para incrementar la cantidad
  incrementarCantidad(index: number) {
    const productosActuales = this.productosEnOrdenSubject.getValue();
    const item = productosActuales[index];
    if (item) {
      item.quantity! += 1; // Aumentar la cantidad
      item.subtotal! = item.price * item.quantity!; // Actualizar el subtotal
      this.productosEnOrdenSubject.next([...productosActuales]); // Emitir el nuevo estado
    }
  }

  // Método para decrementar la cantidad
  decrementarCantidad(index: number) {
    const productosActuales = this.productosEnOrdenSubject.getValue();
    const item = productosActuales[index];
    if (item && item.quantity! > 1) {
      item.quantity! -= 1; // Disminuir la cantidad
      item.subtotal! = item.price * item.quantity!; // Actualizar el subtotal
      this.productosEnOrdenSubject.next([...productosActuales]); // Emitir el nuevo estado
    }
  }

  getTotal(): number {
    return this.productosEnOrdenSubject
      .getValue()
      .reduce((acc, item) => acc + (item.subtotal || 0), 0); // Suma los subtotales
  }
  eliminarTodosLosProductos() {
    this.productosEnOrdenSubject.next([]); // Establece la lista de productos a vacía
  }
}
