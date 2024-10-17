import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationTablesComponent } from './reservation-tables.component';

describe('ReservationTablesComponent', () => {
  let component: ReservationTablesComponent;
  let fixture: ComponentFixture<ReservationTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationTablesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
