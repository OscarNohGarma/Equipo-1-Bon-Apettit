import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaInstalacionesComponent } from './galeria-instalaciones.component';

describe('GaleriaInstalacionesComponent', () => {
  let component: GaleriaInstalacionesComponent;
  let fixture: ComponentFixture<GaleriaInstalacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaInstalacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaleriaInstalacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
