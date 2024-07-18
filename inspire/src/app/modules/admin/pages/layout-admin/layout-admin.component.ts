import { Component, inject } from '@angular/core';
import { DashboardLink } from '../../../../shared/models/dashboardLink';
import { UserService } from '../../../../shared/services/user.service';
import { UserStoreService } from '../../../../shared/services/stores/user-store.service';
import { WindowWatcherService } from '../../../../shared/services/window-watcher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../../shared/services/login.service';
import { BehaviorSubject } from 'rxjs';
import {
  AdminDTO,
  MentorDTO,
  StudentDTO,
} from '../../../../shared/models/user';
import { MentorService } from '../../../../shared/services/mentor.service';
import { SseService } from '../../../../shared/services/sse.service';
import { StudentService } from '../../../../shared/services/student.service';
import { AdminService } from '../../../../shared/services/admin.service';

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss',
})
export class LayoutAdminComponent {
  showNavbar = true;
  modalVisible = false;
  userService = inject(UserService);
  userStoreService = inject(UserStoreService);
  windowWatcher = inject(WindowWatcherService);
  activatedRoute = inject(ActivatedRoute);
  loginService = inject(LoginService);
  router = inject(Router);
  mentorProfil$: BehaviorSubject<MentorDTO> =
    inject(MentorService).activeMentorProfil$;

  studentProfil: BehaviorSubject<StudentDTO> =
    inject(StudentService).activeStudentProfil$;
  sseService = inject(SseService);
  name!: string;
  intro!: string;
  imgUrl!: string;

  displayMobileNav = false;

  listLink: DashboardLink[] = this.userStoreService.getDashboardLinks();

  toggleVisibility(event: Event) {
    event.stopPropagation();
    this.showNavbar = !this.showNavbar;
  }

  logout() {
    this.loginService.logout();
    this.modalVisible = false;
  }

  ngOnInit(): void {
    this.windowWatcher.windowSizeChanged.subscribe((option) => {
      this.showNavbar = option;

      this.intro = 'Votre espace Administrateur';
    });

    // this.imgUrl = this.mentorProfil$.value.imgUrl;
  }

  showModalDeconnection(event: Event) {
    event.stopPropagation();
    this.modalVisible = true;
  }
}
