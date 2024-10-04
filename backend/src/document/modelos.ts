import { ModeloPrincipal } from "./modelo_principal";

export class Citas extends ModeloPrincipal {
    tipocollection: string = "cita";
    fecha: string;
    hora: string;
    tipo_mesa: string;

}

export class Menu extends ModeloPrincipal {
    tipocollection: string = "menu";
    image: string;
    precio: string;
    categoria: string;  
   
}
export class Orden extends ModeloPrincipal {
    tipocollection: string = "orden";
    productos: Array<Map<string, number>>;
    total: number;
 
   
}