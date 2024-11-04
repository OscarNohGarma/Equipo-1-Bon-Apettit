import { TestBed } from '@angular/core/testing';

import { ReservationTablesService } from './reservation-tables.service';

describe('ReservationTablesService', () => {
  let service: ReservationTablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationTablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
