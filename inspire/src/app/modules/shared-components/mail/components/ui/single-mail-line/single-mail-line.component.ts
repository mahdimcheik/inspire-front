import { Component, Input, OnInit } from '@angular/core';
import { Mail } from '../../../../../../shared/models/Mail';

@Component({
  selector: 'app-single-mail-line',
  templateUrl: './single-mail-line.component.html',
  styleUrl: './single-mail-line.component.scss',
})
export class SingleMailLineComponent implements OnInit {
  selected = false;
  @Input() mail!: Mail;
  @Input() order!: string;

  ngOnInit(): void {}
}
