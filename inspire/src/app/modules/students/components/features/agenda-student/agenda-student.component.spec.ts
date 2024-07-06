import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaStudentComponent } from './agenda-student.component';

describe('AgendaStudentComponent', () => {
  let component: AgendaStudentComponent;
  let fixture: ComponentFixture<AgendaStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendaStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendaStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
