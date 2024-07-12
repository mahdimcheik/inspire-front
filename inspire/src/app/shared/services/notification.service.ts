import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { NotificationDTO } from '../models/notification-dto';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  newNotifcations$ = new BehaviorSubject<NotificationDTO[]>([]);
  oldNotifcations$ = new BehaviorSubject<NotificationDTO[]>([]);
  http = inject(HttpClient);
  constructor() {}

  getNotifications(userId: number) {
    return this.http
      .get<NotificationDTO[]>(
        environment.BASE_URL_API + '/notification/get/user/' + userId
      )
      .pipe(
        tap((res) => {
          this.newNotifcations$.next(res);
        })
      );
  }

  getOldNotifications(userId: number) {
    return this.http
      .get<NotificationDTO[]>(
        environment.BASE_URL_API + '/notification/get/user/old/' + userId
      )
      .pipe(
        tap((res) => {
          this.oldNotifcations$.next(res);
        })
      );
  }

  resetNotifications(userId: number) {
    return this.http.get<NotificationDTO[]>(
      environment.BASE_URL_API + '/notification/reset/' + userId
    );
  }
}
