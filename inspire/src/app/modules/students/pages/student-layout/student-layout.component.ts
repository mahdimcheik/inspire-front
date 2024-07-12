import { Component, OnInit, inject } from '@angular/core';
import { WindowWatcherService } from '../../../../shared/services/window-watcher.service';
import { StudentService } from '../../../../shared/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStoreService } from '../../../../shared/services/stores/user-store.service';
import { BehaviorSubject } from 'rxjs';
import { MentorDTO, StudentDTO } from '../../../../shared/models/user';
import { MentorService } from '../../../../shared/services/mentor.service';
import { DashboardLink } from '../../../../shared/models/dashboardLink';
import { UserService } from '../../../../shared/services/user.service';
import { LoginService } from '../../../../shared/services/login.service';

@Component({
  selector: 'app-student-layout',
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.scss',
})
export class StudentLayoutComponent implements OnInit {
  showNavbar = true;
  modalVisible = false;
  userService = inject(UserService);
  userStoreService = inject(UserStoreService);
  windowWatcher = inject(WindowWatcherService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  studentProfil$: BehaviorSubject<StudentDTO> =
    inject(StudentService).activeStudentProfil$;
  loginService = inject(LoginService);

  displayMobileNav = false;

  listLink: DashboardLink[] = this.userStoreService.getDashboardLinks();
  name!: string;
  intro!: string;
  imgUrl!: string;
  toggleVisibility(event: Event) {
    console.log('clicked toggle visibility');

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
      this.name = this.studentProfil$.value.firstname;
      this.intro = 'Votre espace Étudiant de la Wild Code School';
    });

    this.imgUrl = this.studentProfil$.value.imgUrl;
  }

  showModalDeconnection(event: Event) {
    event.stopPropagation();
    this.modalVisible = true;
  }
}
