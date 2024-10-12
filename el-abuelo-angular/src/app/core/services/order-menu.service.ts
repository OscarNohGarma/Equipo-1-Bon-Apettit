import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuProduct } from '../models/menuProduct';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';
import { OrderMenu } from '../models/orderMenu';

@Injectable({
  providedIn: 'root',
})
export class OrderMenuService extends GenericService<OrderMenu> {
  constructor(http: HttpClient) {
    super(http);
  }

  protected override getBaseUrl(): string {
    return 'http://localhost:3000/firebase/orden'; // URL base específica del menú
  }

  // Métodos específicos para el menú

  // Obtener todo el menú
  getOrden(): Observable<OrderMenu[]> {
    return this.getAll('getorden');
  }

  // Obtener un ítem del menú por ID
  getOrdenById(id: string): Observable<OrderMenu> {
    return this.getById('getorden', id);
  }

  // Agregar un ítem al menú
  addOrdenItem(orderItem: OrderMenu): Observable<any> {
    return this.add('addorden', orderItem);
  }

  // Actualizar un ítem del menú
  updateOrdenItem(id: string, updatedOrdenItem: OrderMenu): Observable<any> {
    return this.update('updateorden', id, updatedOrdenItem);
  }

  // Eliminar un ítem del menú
  deleteOrderItem(id: string): Observable<any> {
    return this.delete('deleteorden', id);
  }
}
