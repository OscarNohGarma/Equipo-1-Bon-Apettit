import { MenuProduct } from './menuProduct';

export class OrderItem {
  product: MenuProduct;
  quantity: number;
  subtotal: number;

  constructor(product: MenuProduct, quantity: number) {
    this.product = product;
    this.quantity = quantity;
    this.subtotal = product.price * quantity; // Calcular el subtotal
  }

  // Método para actualizar la cantidad y subtotal
  updateQuantity(newQuantity: number) {
    this.quantity = newQuantity;
    this.subtotal = this.product.price * this.quantity; // Actualizar el subtotal
  }
}
