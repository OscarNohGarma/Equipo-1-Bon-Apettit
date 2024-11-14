import { BaseModel } from '../../shared/baseModel';

export class Community extends BaseModel {
    description: string;
    calification: string;
    fecha: string;  
    hora: string;
    usuario: string;

    constructor(
      id: number,
      namee: string,
      description: string,
      calification: string,
      fecha: string, 
      hora: string,  
      usuario: string,  
      public parentId?: number
    ) {
      super(id, namee); // Hereda id y namee de BaseModel
      this.description = description;
      this.calification = calification;
      this.namee = namee;
      this.fecha = fecha; 
      this.hora = hora; 
      this.usuario = usuario;
    }
}

  