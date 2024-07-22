import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentAdminDTO } from '../../../../../shared/models/user';
import { Observable } from 'rxjs';
import { MessageService, SelectItem } from 'primeng/api';
import { AdminService } from '../../../../../shared/services/admin.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-dashboard-all-students',
  templateUrl: './dashboard-all-students.component.html',
  styleUrl: './dashboard-all-students.component.scss',
})
export class DashboardAllStudentsComponent implements OnInit {
  @ViewChild('studentTable') studentTable!: Table;
  studentList$!: Observable<StudentAdminDTO[]>;
  deleteUser: boolean = false;
  selectedStudent?: StudentAdminDTO;
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
    this.studentList$ = this.adminService.getStudentListByAdmin();
  }

  updateStudent(student: StudentAdminDTO) {
    this.adminService.editStudent(student as StudentAdminDTO).subscribe(() => {
      this.studentList$ = this.adminService.getStudentListByAdmin();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Cet utilisateur a été mis à jour',
      });
    });
  }

  resetStudentRowEdit() {
    this.studentList$ = this.adminService.getStudentListByAdmin();
  }

  deleteStudentRow(mentor: StudentAdminDTO) {
    this.selectedStudent = mentor;
    this.deleteUser = true;
  }

  confirmDeleteStudent() {
    if (this.selectedStudent) {
      this.adminService.deleteStudent(this.selectedStudent).subscribe(() => {
        this.studentList$ = this.adminService.getStudentListByAdmin();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cet utilisateur a été supprimé',
        });
        this.deleteUser = false;
        this.selectedStudent = undefined;
      });
    }
  }

  applyFilterGlobal(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.studentTable.filterGlobal(inputElement.value, 'startsWith');
  }
}
