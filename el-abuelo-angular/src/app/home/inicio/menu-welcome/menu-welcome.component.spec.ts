import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuWelcomeComponent } from './menu-welcome.component';

describe('MenuWelcomeComponent', () => {
  let component: MenuWelcomeComponent;
  let fixture: ComponentFixture<MenuWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuWelcomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
