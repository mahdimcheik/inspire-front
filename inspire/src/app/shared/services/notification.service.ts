import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, forkJoin, tap } from 'rxjs';
import { NotificationDTO } from '../models/notification-dto';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  newNotifcations$ = new BehaviorSubject<NotificationDTO[]>([]);
  oldNotifcations$ = new BehaviorSubject<NotificationDTO[]>([]);
  allNotifcations$ = new BehaviorSubject<{
    news: NotificationDTO[];
    olds: NotificationDTO[];
  }>({ news: [], olds: [] });
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
          console.log('nouvelles ', res);
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

  getAllNotifications(userId: number) {
    return forkJoin({
      news: this.getNotifications(userId),
      olds: this.getOldNotifications(userId),
    }).pipe(tap((res) => this.allNotifcations$.next(res)));
  }

  resetNotifications(userId: number) {
    return this.http.get<NotificationDTO[]>(
      environment.BASE_URL_API + '/notification/reset/' + userId
    );
  }
}
