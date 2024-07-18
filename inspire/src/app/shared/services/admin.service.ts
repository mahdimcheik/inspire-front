import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserStoreService } from './stores/user-store.service';
import { AdminDTO } from '../models/user';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor() {}

  httpClient = inject(HttpClient);
  userConnected = inject(UserStoreService).getUserConnected$();

  activeAdminProfil$: BehaviorSubject<AdminDTO> = new BehaviorSubject<AdminDTO>(
    {} as AdminDTO
  );

  getAdminProfil() {
    return this.httpClient
      .get<AdminDTO>(
        environment.BASE_URL_API + '/admin/' + this.userConnected.value.id
      )
      .pipe(
        tap((res) => {
          this.activeAdminProfil$.next(res);
        })
      );
  }
}
