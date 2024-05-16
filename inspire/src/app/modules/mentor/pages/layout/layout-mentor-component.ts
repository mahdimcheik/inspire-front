import { Component, OnInit, inject } from '@angular/core';
import { WindowWatcherService } from '../../../../shared/services/window-watcher.service';
import { MentorService } from '../../../../shared/services/mentor.service';
import { UserService } from '../../../../user.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Language } from '../../../../shared/models/language';
import { UserStoreService } from '../../../../shared/services/stores/user-store.service';
import { Mentor } from '../../../../shared/models/user';

@Component({
  selector: 'app-side-nav',
  templateUrl: './layout-mentor-component.html',
  styleUrl: './layout-mentor-component.scss',
})
export class LayoutMentor implements OnInit {
  showNavbar = true;
  modalVisible = false;
  userService = inject(UserService);
  userStoreService = inject(UserStoreService);
  windowWatcher = inject(WindowWatcherService);
  activatedRoute = inject(ActivatedRoute);
  mentorService = inject(MentorService);
  mentorProfil$!: BehaviorSubject<Mentor>;
  toggleVisibility() {
    this.showNavbar = !this.showNavbar;
  }

  logout() {
    this.userService.logout();
  }

  ngOnInit(): void {
    this.windowWatcher.windowSizeChanged.subscribe((option) => {
      this.showNavbar = option;
    });
    if (this.userStoreService.getUserConnected$().value?.role === 'mentor') {
      this.mentorService.activeMentorProfil$.next(
        this.activatedRoute.snapshot.data['profil']
      );
      this.mentorService.activeMentorLanguages$.next(
        this.activatedRoute.snapshot.data['languages']
      );
      this.mentorService.activeMentorSkills$.next(
        this.activatedRoute.snapshot.data['skills']
      );
      this.mentorService.activeMentorExperiences$.next(
        this.activatedRoute.snapshot.data['experiences']
      );
      this.mentorService.activeMentorFormations$.next(
        this.activatedRoute.snapshot.data['formations']
      );
    }
    this.mentorProfil$ = this.mentorService.activeMentorProfil$;
  }
}
