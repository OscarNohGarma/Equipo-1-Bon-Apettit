import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarruselClienteComponent } from './carrusel-cliente.component';

describe('CarruselClienteComponent', () => {
  let component: CarruselClienteComponent;
  let fixture: ComponentFixture<CarruselClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarruselClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
