import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private sseEndpoint = environment.BASE_URL_API + '/sse/subscribe/';
  private eventSource!: EventSource;
  private notificationService = inject(NotificationService);

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
    this.notificationService.getNotifications(id).subscribe();
  }
}
