import { ResolveFn } from '@angular/router';
import { NotificationDTO } from '../models/notification-dto';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { UserStoreService } from '../services/stores/user-store.service';

export const notificationResolver: ResolveFn<NotificationDTO[]> = (
  route,
  state
) => {
  const userId = inject(UserStoreService).getUserConnected$().value.id;

  return inject(NotificationService).getNotifications(userId);
  //return inject(NotificationService).getAllNotifications(userId);
};

export const oldNotificationResolver: ResolveFn<NotificationDTO[]> = (
  route,
  state
) => {
  const userId = inject(UserStoreService).getUserConnected$().value.id;

  return inject(NotificationService).getOldNotifications(userId);
};

// allNotificationsResolver
export const allNotificationResolver: ResolveFn<{
  news: NotificationDTO[];
  olds: NotificationDTO[];
}> = (route, state) => {
  const userId = inject(UserStoreService).getUserConnected$().value.id;

  return inject(NotificationService).getAllNotifications(userId);
};
