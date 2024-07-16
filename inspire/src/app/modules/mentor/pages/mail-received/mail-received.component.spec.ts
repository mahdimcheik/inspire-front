import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailReceivedComponent } from './mail-received.component';

describe('MailReceivedComponent', () => {
  let component: MailReceivedComponent;
  let fixture: ComponentFixture<MailReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailReceivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
