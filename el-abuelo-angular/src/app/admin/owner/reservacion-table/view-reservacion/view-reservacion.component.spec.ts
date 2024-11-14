import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReservacionComponent } from './view-reservacion.component';

describe('ViewReservacionComponent', () => {
  let component: ViewReservacionComponent;
  let fixture: ComponentFixture<ViewReservacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReservacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
