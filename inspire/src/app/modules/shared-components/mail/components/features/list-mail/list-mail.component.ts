import { Component, Input } from '@angular/core';
import { ReceivedMail } from '../../../../../../shared/models/Mail';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-list-mail',
  templateUrl: './list-mail.component.html',
  styleUrl: './list-mail.component.scss',
})
export class ListMailComponent {
  @Input() receivedMails$!: BehaviorSubject<ReceivedMail[]>;
}
