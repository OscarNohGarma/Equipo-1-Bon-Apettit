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
  getAll(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.getBaseUrl()}/${endpoint}`);
  }

  // Método para obtener un elemento por ID
  getById(endpoint: string, id: string): Observable<T> {
    return this.http.get<T>(`${this.getBaseUrl()}/${endpoint}/${id}`);
  }

  // Método para agregar un elemento
  add(endpoint: string, item: T): Observable<any> {
    return this.http.post(`${this.getBaseUrl()}/${endpoint}`, item);
  }

  // Método para actualizar un elemento
  update(endpoint: string, id: string, item: T): Observable<any> {
    return this.http.put(`${this.getBaseUrl()}/${endpoint}/${id}`, item);
  }

  // Método para eliminar un elemento
  delete(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${this.getBaseUrl()}/${endpoint}/${id}`);
  }
}
