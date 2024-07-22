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
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DashboardAllStudentsComponent } from './components/features/dashboard-all-students/dashboard-all-students.component';

@NgModule({
  declarations: [DashboardAllMentorsComponent, LayoutAdminComponent, DashboardAllStudentsComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TableModule,
    SidebarModule,
    SharedComponentsModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    TagModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    RippleModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
  ],
})
export class AdminModule {}
