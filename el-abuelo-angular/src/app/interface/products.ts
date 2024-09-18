export class Product {
    id?: number;
    namee: string;
    descripcion: string;
    precio: number;
    stock: number;

    constructor(nombre: string, categoria: string, ubicacion: number, precio: number ){
        this.namee = nombre;
        this.descripcion = categoria;
        this.precio = ubicacion;
        this.stock = precio;
    }
}
