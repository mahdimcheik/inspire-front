import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMailLineComponent } from './single-mail-line.component';

describe('SingleMailLineComponent', () => {
  let component: SingleMailLineComponent;
  let fixture: ComponentFixture<SingleMailLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleMailLineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleMailLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
