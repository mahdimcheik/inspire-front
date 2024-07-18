import { Component, OnInit } from '@angular/core';
import { MentorService } from '../../../../../shared/services/mentor.service';
import { Mentor } from '../../../../../shared/models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-all-mentors',
  templateUrl: './dashboard-all-mentors.component.html',
  styleUrl: './dashboard-all-mentors.component.scss',
})
export class DashboardAllMentorsComponent implements OnInit {
  mentorList$!: Observable<Mentor[]>;

  constructor(private mentorService: MentorService) {}

  ngOnInit(): void {
    this.mentorList$ = this.mentorService.getMentorsList();
  }
}
