import { TestBed } from '@angular/core/testing';

import { OrderMenuService } from './order-menu.service';

describe('OrderMenuService', () => {
  let service: OrderMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
