// SEGUNDO: OrderMenu
import { BaseModel } from '../../shared/baseModel';
import { MenuProduct } from './menuProduct';

export class OrderMenu extends BaseModel {
  fecha: string;
  hora: string;
  total: number;
  productos: MenuProduct[];
  isDetailsOpen?: boolean;

  constructor(
    id: number,
    namee: string,
    fecha: string,
    hora: string,
    total: number,
    productos: MenuProduct[]
  ) {
    super(id, namee); // Hereda id y namee de BaseModel
    this.fecha = fecha;
    this.hora = hora;
    this.total = total;
    this.productos = productos;
  }
}
