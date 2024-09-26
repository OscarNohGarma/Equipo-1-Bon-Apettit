export class MenuProduct {
  id: number; // Asegúrate de tener un identificador único
  name: string;
  image: string;
  price: number;
  category: string;
  quantity?: number; // Atributo opcional para la cantidad
  subtotal?: number; // Atributo opcional para el subtotal

  constructor(
    id: number,
    name: string,
    image: string,
    price: number,
    category: string
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.price = price;
    this.category = category;
    this.quantity = 0; // Inicializa la cantidad en 0
    this.subtotal = 0; // Inicializa el subtotal en 0
  }
}
