import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MailService } from '../../../../../shared/services/mail.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReceivedMail } from '../../../../../shared/models/Mail';

@Component({
  selector: 'app-form-send-mail',
  templateUrl: './form-send-mail.component.html',
  styleUrl: './form-send-mail.component.scss',
})
export class FormSendMailComponent {
  title = 'Sujet';
  fb = inject(FormBuilder);
  mailService = inject(MailService);
  destroyRef = inject(DestroyRef);

  userForm = this.fb.group({
    title: ['', [Validators.required]],
    body: ['', [Validators.minLength(20)]],
    receiverId: [0, [Validators.required]],
  });

  onSubmit() {
    console.log(this.userForm.value);
    this.mailService
      .sendMail(
        this.userForm.value.receiverId || 0,
        this.userForm.value as ReceivedMail
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
