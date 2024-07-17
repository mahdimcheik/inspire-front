import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MailService } from '../../../../shared/services/mail.service';
import { UserStoreService } from '../../../../shared/services/stores/user-store.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-mail-sent',
  templateUrl: './mail-sent.component.html',
  styleUrl: './mail-sent.component.scss',
})
export class MailSentComponent implements OnInit {
  mailService = inject(MailService);
  userService = inject(UserStoreService);
  destroyRef = inject(DestroyRef);
  mails$ = this.mailService.setMails$;

  ngOnInit(): void {
    this.mailService
      .getSentMails(this.userService.getUserConnected$().value.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
