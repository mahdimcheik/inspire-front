import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { UserStoreService } from '../services/stores/user-store.service';
import { AdminDTO, MentorDTO } from '../models/user';
import { Observable } from 'rxjs';

export const adminResolver: ResolveFn<Observable<AdminDTO>> = (
  route,
  state
) => {
  const userId: number = inject(UserStoreService).getUserConnected$().value.id;
  return inject(AdminService).getAdminProfile(userId);
};
