// SEGUNDO: OrderMenu
import { BaseModel } from '../../shared/baseModel';
import { MenuProduct } from './menuProduct';

export class OrderMenu extends BaseModel {
  user: string;
  phone: string;
  fecha: string;
  hora: string;
  total: number;
  productos: MenuProduct[];
  status: string;
  isDetailsOpen?: boolean;
  tipoEntrega: string;
  direccion?: string;

  constructor(
    id: number,
    namee: string,
    user: string,
    phone: string,
    fecha: string,
    hora: string,
    total: number,
    productos: MenuProduct[],
    status: string,
    tipoEntrega: string,
    direccion?: string
  ) {
    super(id, namee); // Hereda id y namee de BaseModel
    this.user = user;
    this.phone = phone;
    this.fecha = fecha;
    this.hora = hora;
    this.total = total;
    this.productos = productos;
    this.status = status;
    this.tipoEntrega = tipoEntrega;
    this.direccion = direccion;
  }
}
