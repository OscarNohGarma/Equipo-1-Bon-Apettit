export class MenuProduct {
  id?: number; // Opcional
  name: string;
  image: string;
  price: number;
  category: string;

  constructor(
    name: string,
    image: string,
    price: number,
    category: string,
    id?: number
  ) {
    this.name = name;
    this.image = image;
    this.price = price;
    this.category = category;
    if (id) this.id = id; // Asigna el id si se proporciona
  }
}
