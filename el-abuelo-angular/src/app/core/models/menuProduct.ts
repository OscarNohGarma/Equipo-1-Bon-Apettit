// PRIMERO: MenuProduct
import { BaseModel } from './baseModel';

export class MenuProduct extends BaseModel {
  image: string;
  precio: number;
  categoria: string;
  quantity?: number; // Atributo opcional para la cantidad
  subtotal?: number; // Atributo opcional para el subtotal

  constructor(
    id: number,
    namee: string,
    image: string,
    precio: number,
    categoria: string
  ) {
    super(id, namee); // Hereda id y namee de BaseModel
    this.image = image;
    this.precio = precio;
    this.categoria = categoria;
    this.quantity = 0; // Inicializa la cantidad en 0
    this.subtotal = 0; // Inicializa el subtotal en 0
  }
}
