import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, first, map, switchMap, tap } from 'rxjs';
import { Mentor, Student, User } from './shared/models/user';
import { UserStoreService } from './shared/services/stores/user-store.service';
import { Router } from '@angular/router';
import { Skill } from './shared/models/chip';
import { Language } from './shared/models/language';
import { Experience } from './shared/models/experience';
import { Formation } from './shared/models/formation';
import { MentorService } from './shared/services/mentor.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly BASE_URL = 'http://localhost:3310';
  private router = inject(Router);
  private http = inject(HttpClient);
  private userStore = inject(UserStoreService);
  private mentorService = inject(MentorService);

  constructor() {}

  private createUser(user: User): Observable<User> {
    if (user.id) {
      delete user.id;
    }
    return this.http.post<User>(`${this.BASE_URL}/users`, user);
  }

  createStudent(registerFormValues: any): Observable<Student> {
    const user: User = new User(
      registerFormValues.email,
      registerFormValues.password,
      'student'
    );

    return this.createUser(user).pipe(
      switchMap((createdUser: User) => {
        const userId = createdUser.userId || 0;

        const student: Student = new Student(
          userId,
          registerFormValues.firstName,
          registerFormValues.lastName,
          '',
          '',
          '',
          '',
          ''
        );

        return this.http.post<Student>(
          `${this.BASE_URL}/student/students`,
          student
        );
      }),
      map((data) => {
        this.router.navigate(['']);
        return data;
      })
    );
  }

  createMentor(registerFormValues: any): Observable<Mentor> {
    const user: User = new User(
      registerFormValues.email,
      registerFormValues.password,
      'mentor'
    );

    return this.createUser(user).pipe(
      switchMap((createdUser: User) => {
        const userId = createdUser.userId;
        const mentor: Mentor = new Mentor(
          userId || 0,
          registerFormValues.firstName,
          registerFormValues.lastName,
          '',
          '',
          '',
          '',
          ''
        );

        return this.http.post<Mentor>(
          `${this.BASE_URL}/mentor/mentors`,
          mentor
        );
      }),
      map((data) => {
        this.router.navigate(['']);
        return data;
      })
    );
  }

  getUserByToken(token: string): Observable<User> {
    return this.http.post<User>(`${this.BASE_URL}/users/me`, { token }).pipe(
      map((user) => {
        const userString = JSON.stringify(user);
        window.localStorage.setItem('user', userString);
        this.userStore.setUserConnected(user);
        return user;
      })
    );
  }

  login(email: any, password: any): Observable<User | null> {
    return (
      this.http
        // .get<User[]>(`${this.BASE_URL}/users?email=${email}&password=${password}`)
        .get<User>(`${this.BASE_URL}/users/${email}/${password}`)

        .pipe(
          map((users) => {
            if (users) {
              const user = users;
              this.userStore.setUserConnected(user);
              const userString = JSON.stringify(user);
              window.localStorage.setItem('user', userString);
              if (user.role === 'mentor') this.router.navigate(['/mentor']);
              if (user.role === 'student') this.router.navigate(['/student']);
              return user;
            } else {
              alert('Identifiants incorrects');
              return null;
            }
          })
        )
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.userStore.setUserConnected(null);
    this.router.navigate(['']);
  }

  getListSkills() {
    return this.http.get<Skill[]>(`${this.BASE_URL}/skill/skills`);
  }

  getListLanguages() {
    return this.http.get<Language[]>(`${this.BASE_URL}/language/languages`);
  }

  postExperience(experience: Experience): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_URL}/experience/experiences/`,
      experience
    );
  }

  editExperience(experience: any, experienceId: any): Observable<Experience> {
    return this.http.put<Experience>(
      `${this.BASE_URL}/experience/experiences/${experienceId}`,
      experience
    );
  }

  editFormation(
    formation: any,
    formationId: any
  ): Observable<{ affectedRows: number }> {
    return this.http.put<{ affectedRows: number }>(
      `${this.BASE_URL}/formation/formations/${formationId}`,
      formation
    );
  }

  deleteFormation(formationId: any): Observable<any> {
    return this.http.delete<any>(
      `${this.BASE_URL}/formation/formations/${formationId}`,
      formationId
    );
  }

  postFormationMentor(formation: Formation): Observable<any> {
    return this.http
      .post<any>(`${this.BASE_URL}/formation/formations/`, formation)
      .pipe(
        tap()
        // (ele) =>
        // this.mentorService.activeMentor$.next({
        //   ...this.mentorService.activeMentor$.value,
        //   formations: ele.formations,
        // })
      );
  }

  deleteExperience(experienceId: any): Observable<any> {
    return this.http.delete<any>(
      `${this.BASE_URL}/experience/experiences/${experienceId}`,
      experienceId
    );
  }
}
