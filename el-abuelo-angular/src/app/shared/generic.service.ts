import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenericService<T> {
  constructor(protected http: HttpClient) {}

  // Configurar la URL base en la clase hija
  protected getBaseUrl(): string {
    return '';
  }

  // Método para obtener todos los elementos
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.getBaseUrl()}`);
  }

  // Método para obtener un elemento por ID
  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.getBaseUrl()}/${id}`);
  }

  // Método para agregar un elemento
  add(item: T): Observable<any> {
    return this.http.post(`${this.getBaseUrl()}`, item);
  }

  // Método para actualizar un elemento
  update(id: string, item: T): Observable<any> {
    return this.http.put(`${this.getBaseUrl()}/${id}`, item);
  }

  // Método para eliminar un elemento
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.getBaseUrl()}/${id}`);
  }
}
