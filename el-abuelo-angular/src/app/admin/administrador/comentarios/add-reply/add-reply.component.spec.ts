import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReplyComponent } from './add-reply.component';

describe('AddReplyComponent', () => {
  let component: AddReplyComponent;
  let fixture: ComponentFixture<AddReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReplyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
