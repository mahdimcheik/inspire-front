import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutAdminComponent } from './pages/layout-admin/layout-admin.component';
import { DashboardAllMentorsComponent } from './components/features/dashboard-all-mentors/dashboard-all-mentors.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: LayoutAdminComponent,
    children: [
      {
        path: '',
        component: DashboardAllMentorsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}