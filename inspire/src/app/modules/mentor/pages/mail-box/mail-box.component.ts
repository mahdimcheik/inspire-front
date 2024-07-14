import { Component } from '@angular/core';
import { Mail } from '../../../../shared/models/Mail';

@Component({
  selector: 'app-mail-box',
  templateUrl: './mail-box.component.html',
  styleUrl: './mail-box.component.scss',
})
export class MailBoxComponent {
  mail: Mail = {
    title: 'new mail 2',
    sentDate: new Date('2024-07-14T13:53:37.4989497'),
    body: 'mail body',
    senderId: 17,
    receiverId: 1,
    senderFirstname: 'Jean',
    senderLastname: 'Dupont',
    senderRole: 'STUDENT',
    opened: false,
  };
}
