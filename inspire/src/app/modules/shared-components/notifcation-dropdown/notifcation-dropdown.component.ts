import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserStoreService } from '../../../shared/services/stores/user-store.service';

@Component({
  selector: 'app-notifcation-dropdown',
  templateUrl: './notifcation-dropdown.component.html',
  styleUrl: './notifcation-dropdown.component.scss',
})
export class NotifcationDropdownComponent {
  items: MenuItem[] | undefined;
  oldItems: MenuItem[] | undefined;
  notificationService = inject(NotificationService);
  user = inject(UserStoreService).getUserConnected$();
  total = '';

  ngOnInit() {
    this.notificationService.allNotifcations$.subscribe((res) => {
      this.total = res.news.length ? '' + res.news.length : '';

      const notifs = res.news.map((ele) => {
        return {
          label: ele.message,
          icon: ele.message.includes('Annulation')
            ? 'pi pi-times'
            : 'pi pi-plus',
          class: ele.message.includes('Annulation')
            ? 'annulation'
            : 'reservation',
          route:
            this.user.value.role === 'MENTOR'
              ? '/mentor'
              : '/student/reservations',
        };
      });
      const oldNotifs = res.olds.map((ele) => {
        return {
          label: ele.message,
          icon: ele.message.includes('Annulation')
            ? 'pi pi-times'
            : 'pi pi-plus',
          class: ele.message.includes('Annulation')
            ? 'annulation-old'
            : 'reservation-old',
          route:
            this.user.value.role === 'MENTOR'
              ? '/mentor'
              : '/student/reservations',
        };
      });
      this.items = [
        {
          label: 'Notifications',
          items: [...notifs, ...oldNotifs],
        },
      ];
    });
  }

  resetNotification() {
    this.total = '';
    this.notificationService.resetNotifications(this.user.value.id).subscribe();
  }
}
