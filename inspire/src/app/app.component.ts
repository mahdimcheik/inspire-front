import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { User } from './shared/models/user';
import { LoginService } from './shared/services/login.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from './shared/services/user.service';
import { UserStoreService } from './shared/services/stores/user-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  userDansLeLocalStorage!: User;
  router = inject(Router);
  destropyRef = inject(DestroyRef);
  isLoading$ = inject(UserService).isLoading$;
  userStoreService = inject(UserStoreService);

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('route url ', this.router.url);

    if (token) {
      this.loginService
        .getUserByToken(token)
        .pipe(takeUntilDestroyed(this.destropyRef))
        .subscribe((res) => {
          console.log('active url ', this.router.url);

          if (res.role) {
            this.userStoreService.setUserConnected(res);

            switch (res.role) {
              case 'MENTOR': {
                this.router.navigateByUrl('/mentor');
                break;
              }
              case 'STUDENT': {
                this.router.navigateByUrl('/student');
                break;
              }
              case 'ADMIN': {
                this.router.navigateByUrl('/admin');
                break;
              }
              case 'SUPER_ADMIN': {
                this.router.navigateByUrl('/admin');
                break;
              }
            }
            // res.role === 'MENTOR'
            //   ? this.router.navigateByUrl('/mentor')
            //   : this.router.navigateByUrl('/student');
          }
        });
    }
  }
}
