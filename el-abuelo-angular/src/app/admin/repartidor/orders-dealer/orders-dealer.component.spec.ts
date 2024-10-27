import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDealerComponent } from './orders-dealer.component';

describe('OrdersDealerComponent', () => {
  let component: OrdersDealerComponent;
  let fixture: ComponentFixture<OrdersDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersDealerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdersDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
