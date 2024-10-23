import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaidComponent } from './order-paid.component';

describe('OrderPaidComponent', () => {
  let component: OrderPaidComponent;
  let fixture: ComponentFixture<OrderPaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPaidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
