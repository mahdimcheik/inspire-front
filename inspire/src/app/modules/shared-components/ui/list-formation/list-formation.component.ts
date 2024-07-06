import { Component, DestroyRef, Input, OnDestroy, inject } from '@angular/core';
import { Formation, FormationDTO } from '../../../../shared/models/formation';
import { WindowWatcherService } from '../../../../shared/services/window-watcher.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../../shared/services/user.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-list-formation',
  templateUrl: './list-formation.component.html',
  styleUrl: './list-formation.component.scss',
})
export class ListFormationComponent {
  @Input() title: string = '';
  @Input() formations!: FormationDTO[];
  @Input() editModeOn: boolean = true;
  maxFormationsNumber: number = environment.MAX_FORMATIONS_NUMBER;
  isVisibleFormCourse = false;

  windowWatcherService = inject(WindowWatcherService);
  userService = inject(UserService);
  destroyRef = inject(DestroyRef);

  constructor(private messageService: MessageService) {}

  addCourse() {
    this.isVisibleFormCourse = true;
  }

  hideAddFormation() {
    this.isVisibleFormCourse = false;
  }

  addNewCourse(formation: Formation) {
    this.userService
      .addFormationUser(formation)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Super ! ',
          detail: 'Votre formation a bien été ajoutée',
        });
      });
  }
}
