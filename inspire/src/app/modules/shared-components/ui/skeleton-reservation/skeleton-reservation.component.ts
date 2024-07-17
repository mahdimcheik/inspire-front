import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-reservation',
  templateUrl: './skeleton-reservation.component.html',
  styleUrl: './skeleton-reservation.component.scss',
})
export class SkeletonReservationComponent {
  @Input() bgColor: string = 'white';
}
