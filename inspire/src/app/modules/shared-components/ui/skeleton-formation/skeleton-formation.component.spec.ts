import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonFormationComponent } from './skeleton-formation.component';

describe('SkeletonFormationComponent', () => {
  let component: SkeletonFormationComponent;
  let fixture: ComponentFixture<SkeletonFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkeletonFormationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkeletonFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
