import { ModeloPrincipal } from "./modelo_principal";

export class Reservaciones extends ModeloPrincipal {
    tipocollection: string = "cita";
    apellido: string;
    telefono: string;
    fecha: string;
    hora: string;
    cantidad: string;
    ubicacion: string;
    costo: string;
    tipo_decoracion: string;
    total: string;
    tipo_banco: string;
    numero_cuenta: string;
    numero_contacto: string;
    estados: string;

}

export class Menu extends ModeloPrincipal {
    tipocollection: string = "menu";
    image: string;
    precio: string;
    categoria: string;  
   
}
export class Comentario extends ModeloPrincipal {
    tipocollection: string = "comentario";
    description: string;
    calification: string;
    fecha : string;  
    hora : string;  
   
}
export class Usuario extends ModeloPrincipal {
    tipocollection: string = "usuario";
    rol: string;
    user: string;
    password : string;
   
}
export class Orden extends ModeloPrincipal {
    tipocollection: string = "orden";
    productos: Array<Map<string, number>>;
    total: number;
 
   
}