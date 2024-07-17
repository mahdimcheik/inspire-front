import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSendMailComponent } from './form-send-mail.component';

describe('FormSendMailComponent', () => {
  let component: FormSendMailComponent;
  let fixture: ComponentFixture<FormSendMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormSendMailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSendMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
