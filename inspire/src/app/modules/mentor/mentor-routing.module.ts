import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutMentor } from './pages/layout/layout-mentor-component';
import { ProfilMentorComponent } from './pages/profil-mentor/profil-mentor.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import {
  mentorReservationsHistoryResolver,
  mentorReservationsResolver,
} from '../../shared/resolvers/reservations.resolver';
import { StudentProfilByMentorComponent } from './pages/student-profil-by-mentor/student-profil-by-mentor.component';
import {
  studentExperiencesByIdResolver,
  studentFormationsByIdResolver,
  studentLanguagesByIdResolver,
  studentProfilByIdResolver,
  studentSkillsByIdResolver,
} from '../../shared/resolvers/student.resolver';
import {
  allNotificationResolver,
  notificationResolver,
} from '../../shared/resolvers/notification.resolver';
import { MailBoxComponent } from './pages/mail-box/mail-box.component';
import { MailSentComponent } from './pages/mail-sent/mail-sent.component';
import { SendMailComponent } from './pages/send-mail/send-mail.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutMentor,
    resolve: {
      notifications: notificationResolver,
      allNotifications: allNotificationResolver,
      //oldNotifications: oldNotificationResolver,
    },
    children: [
      {
        path: '',
        component: DashboardComponent,
        resolve: {
          reservationsData: mentorReservationsResolver,
          reservationsHistoryData: mentorReservationsHistoryResolver,
        },
      },
      {
        path: 'profil',
        component: ProfilMentorComponent,
      },
      {
        path: 'agenda',
        component: AgendaComponent,
      },
      {
        path: 'student-details/:userId',
        component: StudentProfilByMentorComponent,
        resolve: {
          profil: studentProfilByIdResolver,
          languages: studentLanguagesByIdResolver,
          skills: studentSkillsByIdResolver,
          formations: studentFormationsByIdResolver,
          experiences: studentExperiencesByIdResolver,
        },
      },
      {
        path: 'mailbox/received',
        component: MailBoxComponent,
      },
      {
        path: 'mailbox/sent',
        component: MailSentComponent,
      },
      {
        path: 'mailbox/send',
        component: SendMailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule],
  exports: [RouterModule],
})
export class MentorRoutingModule {}
