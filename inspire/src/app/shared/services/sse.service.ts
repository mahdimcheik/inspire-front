import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, first, take } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { UserStoreService } from './stores/user-store.service';
import { ReservationService } from './reservation.service';
import { MentorService } from './mentor.service';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private sseEndpoint = environment.BASE_URL_API + '/sse/subscribe/';
  private eventSource!: EventSource;
  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private userStore = inject(UserStoreService);
  private reservationService = inject(ReservationService);
  private mentorService = inject(MentorService);

  constructor() {}

  public subscribe(id: number) {
    this.eventSource = new EventSource(this.sseEndpoint + id);

    this.eventSource.onopen = (ev) => {
      console.log('first ', ev);
    };
    this.eventSource.onerror = (ev) => {
      console.log(ev);
      return null;
    };
    // this.eventSource.onmessage = (ev) => this.onMessageRecieved(ev);

    this.eventSource.addEventListener('message', (ev) => {
      console.log('recievegin message');
      this.onMessageRecieved(ev, id);
    });
  }

  public onMessageRecieved(ev: MessageEvent<any>, id: number) {
    console.log('message re ' + ev.data);
    this.notificationService.getNotifications(id).subscribe(() => {
      if (!ev.data.includes('connexion')) {
        this.messageService.add({
          severity: 'success',
          summary: 'Notification ',
          detail: 'Vous venez de recevoir une nouvelle notification',
        });
        const path = this.router.url;
        console.log('path', path);
        this.reactOnNotification();
      }
    });
  }

  public reactOnNotification() {
    const path = this.router.url;
    console.log('active path ', path);

    if (this.userStore.getUserConnected$().value.role === 'MENTOR') {
      console.log('is mentor');

      if (path === '/mentor') {
        console.log('in /mentor');

        this.reservationService
          .getMentorReservationList(5, 0)
          .pipe(take(1))
          .subscribe();
      }
      if (path === '/mentor/agenda') {
        this.reservationService
          .getSlotsForMentor(
            this.mentorService.activeMentorProfil$.value.id,
            this.reservationService.MentorViewDateStart.value,
            this.reservationService.MentorViewDateEnd.value
          )
          .pipe(first())
          .subscribe((res) => console.log('respond fro, notif', res));
      }
    }
    if (this.userStore.getUserConnected$().value.role === 'STUDENT') {
      if (path === '/student/reservations') {
        this.reservationService
          .getStudentReservationList(5, 0)
          .pipe(take(1))
          .subscribe();
      }
    }
  }
}
