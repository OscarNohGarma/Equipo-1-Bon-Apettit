export class MenuProduct {
  id?: number;
  name: string;
  image: string;
  price: number;
  category: string;
  constructor(name: string, image: string, price: number, category: string) {
    this.name = name;
    this.image = image;
    this.price = price;
    this.category = category;
  }
}
