import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
  receivedMails$ = this.mailService.receivedMails$;

  ngOnInit(): void {
    this.mailService
      .getReceivedMails(this.userService.getUserConnected$().value.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
