import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Community } from '../models/comentario';
import { GenericService } from '../../shared/generic.service';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CommunityService extends GenericService<Community> {
  constructor(http: HttpClient) {
    super(http);
  }

  protected override getBaseUrl(): string {
    return `${environment.apiUrl}/comentario` // URL específica para la entidad 'comunidad'
  }
}

