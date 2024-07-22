import { Component, OnInit, ViewChild } from '@angular/core';
import { MentorService } from '../../../../../shared/services/mentor.service';
import {
  Mentor,
  MentorListAdminDTO as AdminMentorDTO,
} from '../../../../../shared/models/user';
import { Observable } from 'rxjs';
import { AdminService } from '../../../../../shared/services/admin.service';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-dashboard-all-mentors',
  templateUrl: './dashboard-all-mentors.component.html',
  styleUrl: './dashboard-all-mentors.component.scss',
})
export class DashboardAllMentorsComponent implements OnInit {
  @ViewChild('mentorTable') mentorTable!: Table;
  mentorList$!: Observable<AdminMentorDTO[]>;
  deleteUser: boolean = false;
  selectedMentor?: AdminMentorDTO;
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

  updateMentor(mentor: AdminMentorDTO) {
    this.adminService.editMentor(mentor as AdminMentorDTO).subscribe(() => {
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

  deleteMentorRow(mentor: AdminMentorDTO) {
    this.selectedMentor = mentor;
    this.deleteUser = true;
  }

  confirmDeleteMentor() {
    if (this.selectedMentor) {
      this.adminService.deleteMentor(this.selectedMentor).subscribe(() => {
        this.mentorList$ = this.adminService.getMentorListByAdmin();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cet utilisateur a été supprimé',
        });
        this.deleteUser = false;
        this.selectedMentor = undefined;
      });
    }
  }

  applyFilterGlobal(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.mentorTable.filterGlobal(inputElement.value, 'startsWith');
  }
}
