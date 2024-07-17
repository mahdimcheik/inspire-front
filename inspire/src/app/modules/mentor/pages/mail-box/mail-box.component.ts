import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Mail } from '../../../../shared/models/Mail';
import { MailService } from '../../../../shared/services/mail.service';
import { UserService } from '../../../../shared/services/user.service';
import { UserStoreService } from '../../../../shared/services/stores/user-store.service';
import { takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-mail-box',
  templateUrl: './mail-box.component.html',
  styleUrl: './mail-box.component.scss',
})
export class MailBoxComponent implements OnInit {
  mailService = inject(MailService);
  userService = inject(UserStoreService);
  destroyRef = inject(DestroyRef);
  mails$ = this.mailService.mails$;

  ngOnInit(): void {
    this.mailService
      .getMails(this.userService.getUserConnected$().value.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
