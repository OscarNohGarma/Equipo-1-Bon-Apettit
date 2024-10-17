import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuProduct } from '../models/menuProduct';
import { GenericService } from '../../shared/generic.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends GenericService<MenuProduct> {
  constructor(http: HttpClient) {
    super(http);
  }

  protected override getBaseUrl(): string {
    return 'http://localhost:3000/producto';
  }
}
