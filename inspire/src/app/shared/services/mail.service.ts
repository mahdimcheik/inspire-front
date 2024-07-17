import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, take, tap } from 'rxjs';
import { Mail, MailSend } from '../models/Mail';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  mails$ = new BehaviorSubject<Mail[]>([]);
  setMails$ = new BehaviorSubject<Mail[]>([]);

  http = inject(HttpClient);
  constructor() {}

  getMails(userId: number) {
    return this.http
      .get<Mail[]>(environment.BASE_URL_API + '/mails/receiver/' + userId)
      .pipe(
        tap((mails) => {
          console.log('mails ', mails);
          this.setMails$.next(mails);
        })
      );
  }

  getSentMails(userId: number) {
    return this.http
      .get<Mail[]>(environment.BASE_URL_API + '/mails/sender/' + userId)
      .pipe(
        tap((mails) => {
          console.log('mails ', mails);
          this.mails$.next(mails);
        })
      );
  }

  sendMail(receiverId: number, mail: MailSend) {
    return this.http
      .post<Mail>(environment.BASE_URL_API + '/mails/send/' + receiverId, mail)
      .pipe(
        tap((res) => {
          console.log('mails ', res);
        })
      );
  }
}
