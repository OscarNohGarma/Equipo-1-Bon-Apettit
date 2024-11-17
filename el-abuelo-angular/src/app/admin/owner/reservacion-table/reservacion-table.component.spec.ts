import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionTableComponent } from './reservacion-table.component';

describe('ReservacionTableComponent', () => {
  let component: ReservacionTableComponent;
  let fixture: ComponentFixture<ReservacionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservacionTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservacionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
