import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { ListMentorsComponent } from './pages/list-mentors/list-mentors.component';
import { CardMentorComponent } from './components/features/card-mentor/card-mentor.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { StudentLayoutComponent } from './pages/student-layout/student-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterSearchListComponent } from './components/features/filter-search-list/filter-search-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { DashboardLinkStudentComponent } from './components/ui/dashboard-link-student/dashboard-link-student.component';
import { MentorModule } from '../mentor/mentor.module';
import { ProfilStudentComponent } from './pages/profil-student/profil-student.component';
import { ListFavoritesComponent } from './pages/list-favorites/list-favorites.component';
import { MentorProfilByStudentComponent } from './pages/mentor-profil-by-student/mentor-profil-by-student.component';
import { StudentReservationComponent } from './pages/student-reservation/student-reservation.component';
import { ListStudentReservationComponent } from './components/features/list-student-reservation/list-student-reservation.component';
import { StudentReservationWithSwipeUpcomingComponent } from './components/ui/student-reservation-with-swipe-upcoming/student-reservation-with-swipe-upcoming.component';
import { MentorReservationPageByStudentComponent } from './pages/mentor-reservation-page-by-student/mentor-reservation-page-by-student.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PaginatorModule } from 'primeng/paginator';
import { SidebarModule } from 'primeng/sidebar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AgendaStudentComponent } from './components/features/agenda-student/agenda-student.component';

@NgModule({
  declarations: [
    ListMentorsComponent,
    CardMentorComponent,
    StudentLayoutComponent,
    FilterSearchListComponent,
    DashboardLinkStudentComponent,
    ProfilStudentComponent,
    ListFavoritesComponent,
    MentorProfilByStudentComponent,
    StudentReservationComponent,
    ListStudentReservationComponent,
    StudentReservationWithSwipeUpcomingComponent,
    MentorReservationPageByStudentComponent,
    AgendaStudentComponent,
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedComponentsModule,
    HttpClientModule,
    FormsModule,
    MultiSelectModule,
    ListboxModule,
    MentorModule,
    FullCalendarModule,
    ReactiveFormsModule,
    PaginatorModule,
    SidebarModule,
    FloatLabelModule,
    FormsModule,
  ],
})
export class StudentsModule {}
