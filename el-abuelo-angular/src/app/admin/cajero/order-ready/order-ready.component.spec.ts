import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReadyComponent } from './order-ready.component';

describe('OrderReadyComponent', () => {
  let component: OrderReadyComponent;
  let fixture: ComponentFixture<OrderReadyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderReadyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
