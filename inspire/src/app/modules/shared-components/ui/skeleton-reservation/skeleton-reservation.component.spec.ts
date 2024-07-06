import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonReservationComponent } from './skeleton-reservation.component';

describe('SkeletonReservationComponent', () => {
  let component: SkeletonReservationComponent;
  let fixture: ComponentFixture<SkeletonReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkeletonReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkeletonReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
