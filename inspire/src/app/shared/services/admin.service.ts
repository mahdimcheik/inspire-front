import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserStoreService } from './stores/user-store.service';
import { AdminDTO, MentorListAdminDTO } from '../models/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor() {}

  httpClient = inject(HttpClient);
  userConnected = inject(UserStoreService).getUserConnected$();

  getMentorListByAdmin() {
    return this.httpClient.get<MentorListAdminDTO[]>(
      environment.BASE_URL_API + '/admin/get/mentors'
    );
  }

  deleteMentor(mentor: MentorListAdminDTO): Observable<MentorListAdminDTO> {
    return this.httpClient.delete<MentorListAdminDTO>(
      environment.BASE_URL_API + '/admin/delete/mentor/' + mentor.userId
    );
  }
}
