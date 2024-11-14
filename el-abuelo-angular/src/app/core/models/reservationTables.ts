import { BaseModel } from '../../shared/baseModel';

export class ReservationTables extends BaseModel{

  telefono: string;
  fecha: string;
  hora: string;
  cantidad: string;
  ubicacion: string;
  cantidadMesasReservada: string;
  costo: string;
  total: string;
  tipo_decoracion: string;
  tipo_banco: string;
  numero_cuenta: string;
  image: string;
  numero_contacto: string;
  estados: string;
  usuario: string;
  isDetailsOpen?: boolean;

  constructor(
    id: number,
    namee: string,
    telefono: string,
    fecha: string,
    hora: string,
    cantidad: string,
    ubicacion: string,
    cantidadMesasReservada: string,
    costo: string,
    tipo_decoracion: string,
    total: string,
    tipo_banco: string,
    numero_cuenta: string,
    image: string,
    numero_contacto: string,
    estados: string,
    usuario: string,

  ){
    super(id, namee); //Hereda id y namee de BaseModal
    this.telefono = telefono;
    this.fecha = fecha;
    this.hora = hora;
    this.cantidad = cantidad;
    this.ubicacion = ubicacion;
    this.cantidadMesasReservada = cantidadMesasReservada;
    this.costo = costo;
    this.tipo_decoracion = tipo_decoracion;
    this.total = total;
    this.tipo_banco = tipo_banco;
    this.numero_cuenta = numero_cuenta;
    this.image = image;
    this.numero_contacto = numero_contacto;
    this.estados = estados;
    this.usuario = usuario;
  }
}
