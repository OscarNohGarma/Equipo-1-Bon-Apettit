import { Injectable } from '@angular/core';
import { GenericService } from '../../shared/generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ReservationTables } from '../models/reservationTables';
@Injectable({
  providedIn: 'root'
})
export class ReservationTablesService extends GenericService<ReservationTables> {

  constructor(http:HttpClient) {
    super(http);
  }

  protected override getBaseUrl(): string {
      return `${environment.apiUrl}/reservacion`
  }

}
