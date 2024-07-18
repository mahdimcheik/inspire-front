import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardAllMentorsComponent } from './components/features/dashboard-all-mentors/dashboard-all-mentors.component';
import { TableModule } from 'primeng/table';
import { LayoutAdminComponent } from './pages/layout-admin/layout-admin.component';
import { SidebarModule } from 'primeng/sidebar';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [DashboardAllMentorsComponent, LayoutAdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TableModule,
    SidebarModule,
    SharedComponentsModule,
    ConfirmDialogModule,
    DialogModule,
  ],
})
export class AdminModule {}
