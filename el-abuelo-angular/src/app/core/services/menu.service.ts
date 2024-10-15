import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuProduct } from '../models/menuProduct';
import { Observable } from 'rxjs';
import { GenericService } from '../../shared/generic.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends GenericService<MenuProduct> {
  constructor(http: HttpClient) {
    super(http);
  }

  protected override getBaseUrl(): string {
    return 'http://localhost:3000/firebase/menu'; // URL base específica del menú
  }

  // Métodos específicos para el menú

  // Obtener todo el menú
  getMenu(): Observable<MenuProduct[]> {
    return this.getAll('getmenu');
  }

  // Obtener un ítem del menú por ID
  getMenuById(id: string): Observable<MenuProduct> {
    return this.getById('getmenu', id);
  }

  // Agregar un ítem al menú
  addMenuItem(menuItem: MenuProduct): Observable<any> {
    return this.add('addmenu', menuItem);
  }

  // Actualizar un ítem del menú
  updateMenuItem(id: string, updatedMenuItem: MenuProduct): Observable<any> {
    return this.update('updatemenu', id, updatedMenuItem);
  }

  // Eliminar un ítem del menú
  deleteMenuItem(id: string): Observable<any> {
    return this.delete('deletemenu', id);
  }
}
