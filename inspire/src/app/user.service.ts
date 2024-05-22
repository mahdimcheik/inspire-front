import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, first, map, switchMap, tap } from 'rxjs';
import { Mentor, Student, User } from './shared/models/user';
import { UserStoreService } from './shared/services/stores/user-store.service';
import { Router } from '@angular/router';
import { Skill } from './shared/models/chip';
import { Language } from './shared/models/language';
import { Experience } from './shared/models/experience';
import { Formation } from './shared/models/formation';
import { MentorService } from './shared/services/mentor.service';
import { environment } from '../environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly BASE_URL = 'http://localhost:3310';
  private router = inject(Router);
  private http = inject(HttpClient);
  private userStore = inject(UserStoreService);

  activeMentorFormations$: BehaviorSubject<Formation[]> = new BehaviorSubject(
    [] as Formation[]
  );
  activeMentorExperiences$: BehaviorSubject<Experience[]> = new BehaviorSubject(
    [] as Experience[]
  );
  activeMentorLanguages$: BehaviorSubject<Language[]> = new BehaviorSubject(
    [] as Language[]
  );
  activeMentorSkills$: BehaviorSubject<Skill[]> = new BehaviorSubject(
    [] as Skill[]
  );

  activeStudentLanguages$: BehaviorSubject<Language[]> = new BehaviorSubject(
    [] as Language[]
  );

  activeStudentSkills$: BehaviorSubject<Skill[]> = new BehaviorSubject(
    [] as Skill[]
  );

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
    return this.http
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

  // CRUD languages

  getListLanguages() {
    return this.http.get<Language[]>(`${this.BASE_URL}/language/languages`);
  }

  getMentorLanguages() {
    return this.http
      .get<Language[]>(
        environment.BASE_URL +
          '/language/languages/user/' +
          this.userStore.getUserConnected$().value?.id
      )
      .pipe(tap((languages) => this.activeMentorLanguages$.next(languages)));
  }

  getStudentLanguages() {
    return this.http
      .get<Language[]>(
        environment.BASE_URL +
          '/language/languages/user/' +
          this.userStore.getUserConnected$().value?.id
      )
      .pipe(tap((languages) => this.activeStudentLanguages$.next(languages)));
  }

  updateMentorLanguages(languages: Language[]) {
    console.log('user id', this.userStore.getUserConnected$().value?.id);

    return this.http
      .post<{ success: boolean; message: string; languages: Language[] }>(
        environment.BASE_URL +
          '/language/languages/user/' +
          this.userStore.getUserConnected$().value?.id,
        languages
      )
      .pipe(
        tap((result) => {
          this.activeMentorLanguages$.next(result.languages);
        })
      );
  }

  // CRUD Formation
  getMentorFormations() {
    return this.http
      .get<Formation[]>(
        environment.BASE_URL +
          '/formation/formations/user/' +
          this.userStore.getUserConnected$().value?.id
      )
      .pipe(tap((formations) => this.activeMentorFormations$.next(formations)));
  }

  addFormationMentor(formation: Formation): Observable<{
    success: string;
    message: string;
    formations: Formation[];
  }> {
    return this.http
      .post<{
        success: string;
        message: string;
        formations: Formation[];
      }>(`${environment.BASE_URL}/formation/formations/`, formation)
      .pipe(
        tap((response) =>
          this.activeMentorFormations$.next(response.formations)
        )
      );
  }

  updateFormationMentor(formation: Formation): Observable<{
    success: string;
    affectedRows: number;
    formations: Formation[];
  }> {
    return this.http
      .put<{
        success: string;
        affectedRows: number;
        formations: Formation[];
      }>(
        `${environment.BASE_URL}/formation/formations/${formation.id}`,
        formation
      )
      .pipe(
        tap((response) =>
          this.activeMentorFormations$.next(response.formations)
        )
      );
  }

  deleteFormationMentor(formationId: number): Observable<{
    success: string;
    message: string;
    formations: Formation[];
  }> {
    return this.http
      .delete<{
        success: string;
        message: string;
        formations: Formation[];
      }>(
        `${environment.BASE_URL}/formation/formations/${formationId}/${
          this.userStore.getUserConnected$().value?.id
        }`
      )
      .pipe(
        tap((response) =>
          this.activeMentorFormations$.next(response.formations)
        )
      );
  }

  // CRUD Skill for active mentor
  getMentorSkills() {
    return this.http
      .get<Skill[]>(
        environment.BASE_URL +
          '/skill/skills/user/' +
          this.userStore.getUserConnected$().value?.id
      )
      .pipe(tap((skills) => this.activeMentorSkills$.next(skills)));
  }

  getStudentSkills() {
    return this.http
      .get<Skill[]>(
        environment.BASE_URL +
          '/skill/skills/user/' +
          this.userStore.getUserConnected$().value?.id
      )
      .pipe(tap((skills) => this.activeStudentSkills$.next(skills)));
  }

  updateMentorSkills(skills: Skill[]) {
    return this.http
      .post<{ success: boolean; message: string; skills: Skill[] }>(
        environment.BASE_URL +
          '/skill/skills/user/' +
          this.userStore.getUserConnected$().value?.id,
        skills
      )
      .pipe(tap((result) => this.activeMentorSkills$.next(result.skills)));
  }

  getMentorSkillsById(userId: number) {
    return this.http.get<Skill[]>(
      environment.BASE_URL + '/skill/skills/user/' + userId
    );
  }

  // CRUD Experience
  getMentorExperiences() {
    return this.http
      .get<Experience[]>(
        environment.BASE_URL +
          '/experience/experiences/user/' +
          this.userStore.getUserConnected$().value?.id
      )
      .pipe(
        tap((experiences) => this.activeMentorExperiences$.next(experiences))
      );
  }

  addMentorExperience(experience: Experience): Observable<{
    message: string;
    success: boolean;
    experiences: Experience[];
  }> {
    return this.http
      .post<{
        message: string;
        success: boolean;
        experiences: Experience[];
      }>(`${environment.BASE_URL}/experience/experiences/`, {
        ...experience,
        userId: this.userStore.getUserConnected$().value?.id,
      })
      .pipe(
        tap((response) =>
          this.activeMentorExperiences$.next(response.experiences)
        )
      );
  }

  editExperience(
    experience: Experience,
    experienceId: number
  ): Observable<{
    affectedRows: number;
    experiences: Experience[];
  }> {
    return this.http
      .put<{
        affectedRows: number;
        experiences: Experience[];
      }>(`${this.BASE_URL}/experience/experiences/${experienceId}`, {
        ...experience,
        userId: this.userStore.getUserConnected$().value?.id,
      })
      .pipe(
        tap((result) => {
          this.activeMentorExperiences$.next(result.experiences);
          console.log(result);
        })
      );
  }

  deleteExperience(experienceId: number): Observable<{
    message: string;
    success: boolean;
    experiences: Experience[];
  }> {
    return this.http
      .delete<{
        message: string;
        success: boolean;
        experiences: Experience[];
      }>(
        `${this.BASE_URL}/experience/experiences/${experienceId}/${
          this.userStore.getUserConnected$().value?.id
        }`
      )
      .pipe(tap((res) => this.activeMentorExperiences$.next(res.experiences)));
  }
}
