import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserDTO } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private userConnected$: BehaviorSubject<UserDTO> =
    new BehaviorSubject<UserDTO>({} as UserDTO);

  token$: BehaviorSubject<string> = new BehaviorSubject('');

  getUserConnected$(): BehaviorSubject<UserDTO> {
    return this.userConnected$;
  }

  setUserConnected(user: UserDTO): void {
    this.userConnected$.next(user);
  }

  getUserId(): number {
    return this.userConnected$.value?.id ?? null;
  }

  getDashboardLinks() {
    if (this.userConnected$.value.role === 'STUDENT')
      return [
        {
          title: 'Mon profil',
          logoUrl: 'assets/svgs/profile.svg',
          logoUrlActive: 'assets/svgs/profile-blanc.svg',
          path: 'student',
          active: true,
        },
        {
          title: 'Trouver un mentor',
          logoUrl: 'assets/svgs/find.svg',
          logoUrlActive: 'assets/svgs/find-blanc.svg',
          path: 'student/list-mentors',
          active: false,
        },
        {
          title: 'Mes réservations',
          logoUrl: 'assets/svgs/agenda.svg',
          logoUrlActive: 'assets/svgs/agenda-blanc.svg',
          path: 'student/reservations',
          active: false,
        },
        {
          title: 'Mes favoris',
          logoUrl: 'assets/svgs/coeur.svg',
          logoUrlActive: 'assets/svgs/coeur-blanc.svg',
          path: 'student/list-favorites',
          active: false,
        },
      ];
    if (this.userConnected$.value.role === 'MENTOR')
      return [
        {
          title: 'Mes Réservations',
          logoUrl: 'assets/svgs/tdb.svg',
          logoUrlActive: 'assets/svgs/dash-blanc.svg',
          path: 'mentor',
          active: true,
        },
        {
          title: 'mon profil',
          logoUrl: 'assets/svgs/profile.svg',
          logoUrlActive: 'assets/svgs/profile-blanc.svg',
          path: 'mentor/profil',
          active: false,
        },
        {
          title: 'agenda',
          logoUrl: 'assets/svgs/agenda.svg',
          logoUrlActive: 'assets/svgs/agenda-blanc.svg',
          path: 'mentor/agenda',
          active: false,
        },
        {
          title: 'mail',
          logoUrl: 'assets/svgs/agenda.svg',
          logoUrlActive: 'assets/svgs/agenda-blanc.svg',
          path: 'mentor/mailbox',
          active: false,
        },
      ];
    return [];
  }
}
