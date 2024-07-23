import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutAdminComponent } from './pages/layout-admin/layout-admin.component';
import { DashboardAllMentorsComponent } from './components/features/dashboard-all-mentors/dashboard-all-mentors.component';
import { DashboardAllStudentsComponent } from './components/features/dashboard-all-students/dashboard-all-students.component';
import { adminResolver } from '../../shared/resolvers/admin.resolver';

const routes: Routes = [
  {
    path: '',
    component: LayoutAdminComponent,
    resolve: { data: adminResolver },
    children: [
      {
        path: 'mentors',
        component: DashboardAllMentorsComponent,
      },
      { path: 'students', component: DashboardAllStudentsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
