import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interface/products';
@Injectable({
  providedIn: 'root'
})


export class ProductoService {
  private url: string;
 
 constructor(private http: HttpClient) {
    //this.url = 'http://localhost:3000/api/productos/';
    this.url = 'http://localhost:3000/producto/';
  }
  getProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }
  deleteProductos(id: number): Observable<any> {
    return this.http.delete(this.url + id);
  }
  saveProductos(product : Product): Observable<void>{
    return this.http.post<void>(this.url,product);
  }
  getProductoUno(id : number): Observable<Product>{
    return this.http.get<Product>(this.url + id)
  }

  updateProduct(id:number, product:Product): Observable<void>{
    return this.http.put<void>(this.url + id,product)
  }
  
}