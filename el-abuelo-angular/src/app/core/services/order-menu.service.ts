import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderMenu } from '../models/orderMenu';
import { GenericService } from '../../shared/generic.service';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderMenuService extends GenericService<OrderMenu> {
  constructor(http: HttpClient) {
    super(http);
  }

  protected override getBaseUrl(): string {
    return `${environment.apiUrl}/orden`;
  }
}
