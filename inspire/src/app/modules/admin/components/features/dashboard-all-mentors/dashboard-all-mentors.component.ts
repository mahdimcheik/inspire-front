import { Component, OnInit } from '@angular/core';
import { MentorService } from '../../../../../shared/services/mentor.service';
import { Mentor, MentorListAdminDTO } from '../../../../../shared/models/user';
import { Observable } from 'rxjs';
import { AdminService } from '../../../../../shared/services/admin.service';
import { MessageService, SelectItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard-all-mentors',
  templateUrl: './dashboard-all-mentors.component.html',
  styleUrl: './dashboard-all-mentors.component.scss',
})
export class DashboardAllMentorsComponent implements OnInit {
  mentorList$!: Observable<MentorListAdminDTO[]>;
  statuses: SelectItem[] = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Mentor', value: 'MENTOR' },
    { label: 'Student', value: 'STUDENT' },
  ];

  constructor(
    private adminService: AdminService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.mentorList$ = this.adminService.getMentorListByAdmin();
  }

  updateMentor(mentor: MentorListAdminDTO) {
    this.adminService.editMentor(mentor as MentorListAdminDTO).subscribe(() => {
      this.mentorList$ = this.adminService.getMentorListByAdmin();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Cet utilisateur a été mis à jour',
      });
    });
  }

  resetMentorRowEdit() {
    this.mentorList$ = this.adminService.getMentorListByAdmin();
  }

  deleteMentorRow(mentor: MentorListAdminDTO) {
    this.adminService
      .deleteMentor(mentor as MentorListAdminDTO)
      .subscribe(() => {
        this.mentorList$ = this.adminService.getMentorListByAdmin();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cet utilisateur a été supprimé',
        });
      });
  }
}
