import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar el módulo de pruebas de HttpClient
import { GenericService } from './generic.service';
import { MenuProduct } from '../core/models/menuProduct';

describe('GenericService', () => {
  let service: GenericService<MenuProduct>; // Especificar el tipo aquí

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importar el módulo para poder usar HttpClient
      providers: [GenericService], // Proveer el GenericService
    });
    service = TestBed.inject(GenericService); // Inyectar el servicio
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
