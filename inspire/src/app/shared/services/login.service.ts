import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserStoreService } from './stores/user-store.service';
import { first, Observable, Subject, tap } from 'rxjs';
import { LoginDTO, UserDTO } from '../models/user';
import { BroadcastMessage } from '../models/broadcastMessage';
import { environment } from '../../../environments/environment.development';
import { SseService } from './sse.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private userStore = inject(UserStoreService);
  private sseService = inject(SseService);

  private readonly BASE_URL_API = environment.BASE_URL_API;

  getUserByToken(token: string): Observable<UserDTO> {
    this.userStore.token$.next(token);
    return this.http.get<UserDTO>(`${this.BASE_URL_API}/api/v1/users/me`).pipe(
      tap((user) => {
        this.sseService.subscribe(user.id);
        this.userStore.setUserConnected(user);
      })
    );
  }

  login(email: string, password: string): Observable<UserDTO> {
    const user = { email, password } as LoginDTO;
    return this.http
      .post<UserDTO>(`${this.BASE_URL_API}/api/v1/auth/authenticate `, user)
      .pipe(
        tap((users) => {
          if (users) {
            const user = users;
            this.userStore.setUserConnected(user);
            this.userStore.token$.next(user.token);
            this.sseService.subscribe(users.id);
            window.localStorage.setItem('token', user.token);
            this.publish({
              type: 'login',
              payload: this.userStore.getUserConnected$().value,
            });

            if (user.role === 'MENTOR') {
              this.router.navigate(['/mentor']);
            }
            if (user.role === 'STUDENT') {
              this.router.navigate(['/student']);
            }
          } else {
            alert('Identifiants incorrects');
          }
        })
      );
  }

  loginTabs(message: BroadcastMessage) {
    if (message) {
      this.userStore.setUserConnected(message.payload as UserDTO);
      if (message.payload.role === 'MENTOR') this.router.navigate(['/mentor']);
      if (message.payload.role === 'STUDENT')
        this.router.navigate(['/student']);
    }
  }

  logout() {
    const user = this.userStore.getUserConnected$().value;
    const token = this.userStore.token$.value;
    if (user && (user.email || user.token || user.id)) {
      localStorage.removeItem('token');
      this.userStore.setUserConnected({} as UserDTO);
      this.userStore.token$.next('');
      this.router.navigate(['']);
      this.publish({ type: 'logout' } as BroadcastMessage);
      this.http
        .get(
          environment.BASE_URL_API + '/sse/unsubscribe/' + user.id + '/' + token
        )
        .pipe(first())
        .subscribe();
    }
  }

  // Tabs communication

  // onMessage = new Subject();
  broadcastChannel = new BroadcastChannel('logout');

  constructor() {
    this.broadcastChannel.onmessage = (
      message: MessageEvent<BroadcastMessage>
    ) => {
      if (message.data.type === 'logout') {
        this.logout();
      }
      if (message.data.type === 'login') {
        this.loginTabs(message.data);
      }
    };
  }

  publish(message: BroadcastMessage): void {
    this.broadcastChannel.postMessage(message);
  }
}
