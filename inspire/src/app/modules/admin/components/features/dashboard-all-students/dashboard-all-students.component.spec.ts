import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAllStudentsComponent } from './dashboard-all-students.component';

describe('DashboardAllStudentsComponent', () => {
  let component: DashboardAllStudentsComponent;
  let fixture: ComponentFixture<DashboardAllStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardAllStudentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardAllStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
