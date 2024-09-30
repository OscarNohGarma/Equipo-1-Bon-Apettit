import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuProduct } from '../models/menuProduct';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private baseUrl = 'http://localhost:3000/firebase/menu'; // URL base

  constructor(private http: HttpClient) {}

  // Obtener todo el menú y mapear los datos a MenuProduct
  getMenu(): Observable<MenuProduct[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/getmenu`)
      .pipe(
        map((menuItems) =>
          menuItems.map(
            (item) =>
              new MenuProduct(
                item.id,
                item.namee,
                item.image,
                item.precio,
                item.categoria
              )
          )
        )
      );
  }

  // Obtener un ítem del menú por ID
  getMenuById(id: string): Observable<MenuProduct> {
    return this.http
      .get<any>(`${this.baseUrl}/getmenu/${id}`)
      .pipe(
        map(
          (item) =>
            new MenuProduct(
              item.id,
              item.namee,
              item.image,
              item.precio,
              item.categoria
            )
        )
      );
  }

  // Agregar un ítem al menú
  addMenuItem(menuItem: MenuProduct): Observable<any> {
    // Sólo envías los atributos que están en la base de datos
    const { id, name, image, price, category } = menuItem;
    return this.http.post(`${this.baseUrl}/addmenu`, {
      name,
      image,
      price,
      category,
    });
  }

  // Actualizar un ítem del menú
  updateMenuItem(id: string, updatedMenuItem: MenuProduct): Observable<any> {
    const { name, image, price, category } = updatedMenuItem;
    return this.http.put(`${this.baseUrl}/updatemenu/${id}`, {
      name,
      image,
      price,
      category,
    });
  }

  // Eliminar un ítem del menú
  deleteMenuItem(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deletemenu/${id}`);
  }
}
