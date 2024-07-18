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
  mentors: MentorListAdminDTO[] = [];
  statuses!: SelectItem[];
  clonedMentors: { [s: string]: MentorListAdminDTO } = {};

  constructor(
    private adminService: AdminService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.mentorList$ = this.adminService.getMentorListByAdmin();
    this.mentorList$.subscribe((data) => {
      this.mentors = data;
    });

    this.statuses = [
      { label: 'Admin', value: 'ADMIN' },
      { label: 'Mentor', value: 'MENTOR' },
      { label: 'Student', value: 'STUDENT' },
    ];
  }

  onRowEditInit(mentor: MentorListAdminDTO) {
    this.clonedMentors[mentor.userId as any] = { ...mentor };
  }

  onRowEditSave(mentor: MentorListAdminDTO) {
    // Ajoutez votre propre logique de validation ici
    if (mentor.role) {
      delete this.clonedMentors[mentor.userId as any];
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Mentor is updated',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid Role',
      });
    }
  }

  onRowEditCancel(mentor: MentorListAdminDTO, index: number) {
    this.mentors[index] = this.clonedMentors[mentor.userId as any];
    delete this.clonedMentors[mentor.userId as any];
  }
}