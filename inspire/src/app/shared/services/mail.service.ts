import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { MailSend, ReceivedMail, SentMail } from '../models/Mail';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  receivedMails$ = new BehaviorSubject<ReceivedMail[]>([]);
  sentMails$ = new BehaviorSubject<SentMail[]>([]);

  http = inject(HttpClient);
  constructor() {}

  getReceivedMails(userId: number) {
    return this.http
      .get<ReceivedMail[]>(
        environment.BASE_URL_API + '/mails/receiver/' + userId
      )
      .pipe(
        tap((mails) => {
          console.log('mails ', mails);
          this.receivedMails$.next(mails);
        })
      );
  }

  getSentMails(userId: number) {
    return this.http
      .get<SentMail[]>(environment.BASE_URL_API + '/mails/sender/' + userId)
      .pipe(
        tap((mails) => {
          console.log('mails ', mails);
          this.sentMails$.next(mails);
        })
      );
  }

  sendMail(receiverId: number, mail: MailSend) {
    return this.http
      .post<SentMail>(
        environment.BASE_URL_API + '/mails/send/' + receiverId,
        mail
      )
      .pipe(
        tap((res) => {
          console.log('mails ', res);
        })
      );
  }
}
