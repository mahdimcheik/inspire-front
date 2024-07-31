import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserStoreService } from './stores/user-store.service';
import {
  AdminDTO,
  MentorDTO,
  MentorListAdminDTO,
  StudentAdminDTO,
} from '../models/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor() {}

  httpClient = inject(HttpClient);
  userConnected = inject(UserStoreService).getUserConnected$();
  adminProfil$ = new BehaviorSubject<AdminDTO>({} as AdminDTO);

  getAdminProfile(userId: number) {
    if (this.userConnected.value.role === 'ADMIN')
      return this.httpClient
        .get<AdminDTO>(
          environment.BASE_URL_API + '/admin/get/profile/' + userId
        )
        .pipe(
          tap((res) => {
            this.adminProfil$.next(res);
            console.log('admin profil ', res);
          })
        );
    if (this.userConnected.value.role === 'SUPER_ADMIN')
      return this.httpClient
        .get<AdminDTO>(
          environment.BASE_URL_API + '/superadmin/get/profile/' + userId
        )
        .pipe(
          tap((res) => {
            this.adminProfil$.next(res);
            console.log('admin profil ', res);
          })
        );
    return null;
  }

  getMentorListByAdmin() {
    return this.httpClient.get<MentorListAdminDTO[]>(
      environment.BASE_URL_API + '/admin/get/mentors'
    );
  }

  getStudentListByAdmin() {
    return this.httpClient.get<StudentAdminDTO[]>(
      environment.BASE_URL_API + '/admin/get/students'
    );
  }

  deleteMentor(mentor: MentorListAdminDTO): Observable<MentorListAdminDTO> {
    return this.httpClient.delete<MentorListAdminDTO>(
      environment.BASE_URL_API + '/admin/delete/mentor/' + mentor.userId
    );
  }

  deleteStudent(student: StudentAdminDTO): Observable<StudentAdminDTO> {
    return this.httpClient.delete<StudentAdminDTO>(
      environment.BASE_URL_API + '/admin/delete/student/' + student.userId
    );
  }

  editMentor(mentor: MentorListAdminDTO): Observable<MentorListAdminDTO> {
    return this.httpClient.put<MentorListAdminDTO>(
      environment.BASE_URL_API + '/admin/update/' + mentor.userId,
      mentor
    );
  }

  editStudent(student: StudentAdminDTO): Observable<StudentAdminDTO> {
    return this.httpClient.put<StudentAdminDTO>(
      environment.BASE_URL_API + '/admin/update/' + student.userId,
      student
    );
  }
}
