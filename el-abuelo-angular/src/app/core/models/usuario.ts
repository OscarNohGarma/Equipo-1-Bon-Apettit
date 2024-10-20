import { BaseModel } from '../../shared/baseModel';

export class Usuario extends BaseModel {
  rol: string;
  user: string;
  password: string;
  phone?: string;

  constructor(
    id: number,
    namee: string,
    rol: string,
    user: string,
    password: string,
    phone?: string
  ) {
    super(id, namee);
    this.rol = rol;
    this.user = user;
    this.password = password;
    this.phone = phone;
  }
}
