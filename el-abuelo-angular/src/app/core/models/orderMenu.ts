import { MenuProduct } from './menuProduct';

export class OrderMenu {
  id: number; // Asegúrate de tener un identificador único
  namee: string;
  fecha: string;
  hora: string;
  total: number;
  productos: MenuProduct[];

  constructor(
    id: number,
    namee: string,
    fecha: string,
    hora: string,
    total: number,
    productos: MenuProduct[]
  ) {
    this.id = id;
    this.namee = namee;
    this.total = total;
    this.productos = productos;
    this.fecha = fecha;
    this.hora = hora;
  }
}
