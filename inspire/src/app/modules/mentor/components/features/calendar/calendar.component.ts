import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  CalendarOptions,
  DatesSetArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction';
import { ReservationService } from '../../../../../shared/services/reservation.service';
import { MentorService } from '../../../../../shared/services/mentor.service';
import { Subject, Subscription, switchMap } from 'rxjs';
import { MentorDTO } from '../../../../../shared/models/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateTimeService } from '../../../../../shared/services/dateTime.service';
import { MessageService } from 'primeng/api';
import { Slot, SlotDTO } from '../../../../../shared/models/reservation';

type NewType = AfterViewChecked;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;

  today = signal('');
  visible = false;
  mentorId!: number;
  userId!: number;
  mentorSubscription!: Subscription;
  @Input() formattedSlotInfo!: any;
  events: EventInput[] = [];
  displayModal: boolean = false;
  eventDetails: Slot = {} as Slot;
  eventDetailsEdit: any = {};
  dateStart!: Date;
  dateEnd!: Date;
  currentDate!: Date;

  mode: string = '';
  isModfify: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private mentorService: MentorService,
    private fb: FormBuilder,
    private dateTimeService: DateTimeService,
    private messageService: MessageService
  ) {}

  formulaire: FormGroup = this.fb.group({
    mode: ['presentiel'],
  });

  updateMode() {
    this.formattedSlotInfo.visio = this.formulaire.value.mode === 'visio';
  }

  selectAllow = (selectionInfo: any) => {
    return selectionInfo.start > new Date();
  };

  eventAllow = (dropInfo: any, draggedEvent: any) => {
    const now = new Date();
    const booked = draggedEvent.extendedProps.booked;
    return dropInfo.start >= now && !booked;
  };

  onDateSelect = (selectionInfo: any) => {
    if (this.formulaire.valid) {
      const diffMilliseconds = selectionInfo.end - selectionInfo.start;
      const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor(
        (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );

      const formattedDuration = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

      const startLocalDateTime =
        this.dateTimeService.convertToLocalDateTimeString(selectionInfo.start);
      const endLocalDateTime =
        this.dateTimeService.convertToLocalDateTimeString(selectionInfo.end);

      this.formattedSlotInfo = {
        // formattedDuration,
        dateBegin: startLocalDateTime,
        dateEnd: endLocalDateTime,
        visio: this.formulaire.value.mode === 'visio',
        mentorId: this.mentorId,
      };

      this.visible = true;
    } else {
      console.error("Veuillez d'abord soumettre le formulaire.");
    }
  };

  validateSlot() {
    console.log(' new slot', this.formattedSlotInfo);
    this.reservationService
      .addSlotToMentor(this.formattedSlotInfo, this.dateStart, this.dateEnd)
      .subscribe(() => {
        this.visible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Super ! ',
          detail: 'Votre créneau a bien été ajoutée',
        });
        this.loadSlots();
      });
  }

  deleteSlot() {
    this.reservationService
      .deleteSlot(this.eventDetails.id || 0)
      .subscribe(() => {
        this.displayModal = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Super ! ',
          detail: 'Votre créneau a bien été supprimé',
        });
        this.loadSlots();
      });
  }

  editSlot() {
    this.eventDetailsEdit = {
      id: this.eventDetails.id,
      start: this.eventDetails.dateBegin,
      end: this.eventDetails.dateEnd,
      visio: this.eventDetails.visio,
    };
    this.isModfify = true;
  }

  editForm: FormGroup = this.fb.group({
    id: [''],
    dateStart: [''],
    dateEnd: [''],
    visio: ['Présentiel'],
  });

  validateAndLog(field: string) {
    const date: Date = this.editForm.get(field)?.value;
    if (date) {
      const formattedDate = this.formatDate(date);
    }
  }

  onSubmit() {
    if (!this.eventDetails.id) {
      console.error("ID de l'événement non défini.");
      return;
    }

    const id = Number(this.eventDetails.id);
    const dateBegin = this.dateTimeService.convertToLocalDateTimeString(
      this.eventDetails.dateBegin
    );
    const dateEnd = this.dateTimeService.convertToLocalDateTimeString(
      this.eventDetails.dateEnd
    );

    const visio = this.editForm.value.visio === 'visio';
    const mentorId = this.mentorId;

    const slotInfo = {
      id,
      dateBegin,
      dateEnd,
      visio,
      mentorId,
    };

    this.reservationService.updateSlot(id, slotInfo).subscribe(
      () => {
        this.displayModal = false;
        this.loadSlots();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du slot:', error);
      }
    );
  }

  onSubmitDrop() {
    if (!this.eventDetailsEdit.id) {
      console.error("ID de l'événement non défini.");
      return;
    }

    const id = Number(this.eventDetailsEdit.id);
    const dateBegin = this.dateTimeService.convertToLocalDateTimeString(
      this.eventDetailsEdit.start
    );
    const dateEnd = this.dateTimeService.convertToLocalDateTimeString(
      this.eventDetailsEdit.end
    );

    const visio = this.editForm.value.visio === 'visio';
    const mentorId = this.mentorId;

    const slotInfo = {
      id,
      dateBegin,
      dateEnd,
      visio,
      mentorId,
    };

    this.reservationService.updateSlot(id, slotInfo).subscribe(
      () => {
        this.displayModal = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Super ! ',
          detail: 'Votre créneau a bien été mis à jour',
        });
        this.isModfify = false;
        this.loadSlots();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du slot:', error);
      }
    );
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  handleEventDrop(eventDropArg: any) {
    this.eventDetails = {
      id: eventDropArg.oldEvent.id,
      dateBegin: eventDropArg.oldEvent.start,
      dateEnd: eventDropArg.oldEvent.end,
      visio: eventDropArg.oldEvent.extendedProps.visio,
    };

    this.displayModal = true;
    this.isModfify = true;

    this.eventDetailsEdit = {
      id: eventDropArg.oldEvent.id,
      start: eventDropArg.event.start,
      end: eventDropArg.event.end,
      visio: eventDropArg.oldEvent.extendedProps.visio,
    };

    this.displayModal = true;
    this.isModfify = true;
  }

  closeModal() {
    this.displayModal = false;
    this.isModfify = false;
    this.loadSlots();
  }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    // datesSet: this.handleDatesSet.bind(this),

    locale: frLocale,
    headerToolbar: {
      right: '',
      left: '',
      center: '',
    },
    views: {
      dayGridMonth: {
        titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
      },
      timeGridFiveDays: {
        type: 'timeGrid',
        duration: { days: 4 },
      },

      validRange: {
        start: '2024-05-24',
      },
    },
    weekends: true,
    slotDuration: '00:15:00',
    slotMinTime: '09:00',
    slotMaxTime: '19:00',
    allDaySlot: false,

    navLinks: true,
    eventStartEditable: true,
    eventOverlap: false,
    eventDrop: this.handleEventDrop.bind(this),
    weekNumbers: true,
    selectMirror: true,
    unselectAuto: true,
    selectOverlap: false,
    editable: true,
    selectable: true,
    eventDurationEditable: true,
    defaultTimedEventDuration: '01:00:00',
    nowIndicator: true,

    droppable: false,
    eventContent: this.renderEventContent.bind(this),
    select: this.onDateSelect,
    selectAllow: this.selectAllow,
    eventClick: this.handleEventClick.bind(this),
    eventAllow: this.eventAllow.bind(this),
  };

  renderEventContent(arg: any) {
    let html = `<div class="custom-event">
                  <b>${arg.event.title}</b>
                  <div>${
                    arg.event.extendedProps['booked']
                      ? `<div class="slot-content"><img src=${arg.event.extendedProps.imgUrl} width="24" height="24"/><span>${arg.event.extendedProps.firstname}</span></div>
                      <div class="sujet">Sujet : ${arg.event.extendedProps.subject}</div>
                      `
                      : 'Créneau disponible'
                  }</div>
                </div>`;
    let arrayOfDomNodes = [];
    let div = document.createElement('div');
    div.innerHTML = html;
    arrayOfDomNodes.push(div.firstChild);
    return { domNodes: arrayOfDomNodes };
  }

  handleEventClick(eventClickArg: EventClickArg) {
    this.eventDetails = {
      id: +eventClickArg.event.id,
      // title: eventClickArg.event.title,
      dateBegin: eventClickArg.event.start || new Date(),
      dateEnd: eventClickArg.event.end || new Date(),
      visio: eventClickArg.event.extendedProps['visio'],
    };

    this.editForm.setValue({
      id: '',
      dateStart: '',
      dateEnd: '',
      visio: eventClickArg.event.extendedProps['visio']
        ? 'visio'
        : 'presentiel',
    });

    this.displayModal = true;
    eventClickArg.jsEvent.preventDefault();
  }

  loadSlots(): void {
    const mentorId = this.mentorId;
    this.reservationService
      .getSlotsForMentor(mentorId, this.dateStart, this.dateEnd)
      .subscribe((slots) => {
        this.events = this.formatSlotsToEvents(slots);
      });
  }

  formatSlotsToEvents(slots: any[]): EventInput[] {
    return slots.map((slot) => ({
      id: slot.id,
      title: slot.visio ? 'Visio' : 'Présentiel',
      start: slot.dateBegin,
      end: slot.dateEnd,
      color:
        slot.reservationId !== null
          ? '#447597'
          : slot.visio
          ? '#FCBE77'
          : '#F8156B',
      extendedProps: {
        visio: slot.visio,
        booked: !!slot.reservationId,
        imgUrl: slot.imgUrl,
        firstname: slot.firstname,
        subject: slot.subject,
      },
    }));
  }

  ngOnInit(): void {
    this.calendarOptions.locale = frLocale;
    this.calendarOptions.allDayText = 'Heures';

    this.mentorSubscription = this.mentorService.activeMentorProfil$.subscribe(
      (mentor: MentorDTO) => {
        if (mentor && mentor.id) {
          this.mentorId = mentor.id;
        }
      }
    );
  }

  ngAfterViewInit(): void {
    const calendarApi = this.calendarComponent.getApi();
    this.dateStart = calendarApi.view.currentStart;
    this.dateEnd = calendarApi.view.currentEnd;
    this.currentDate = calendarApi.getDate();
    this.loadSlots();
    setTimeout(() => {
      this.today = signal('today');
    }, 10);
  }
  ngAfterViewChecked(): void {}

  updateViewDates() {
    const calendarApi = this.calendarComponent.getApi();
    this.dateStart = calendarApi.view.currentStart;
    this.dateEnd = calendarApi.view.currentEnd;
    this.currentDate = calendarApi.getDate();
    this.loadSlots();
    setTimeout(() => {
      this.today = signal('today');
    }, 10);
  }
  next(): void {
    this.calendarComponent.getApi().next();
    this.updateViewDates();
  }
  prev(): void {
    this.calendarComponent.getApi().prev();
    this.updateViewDates();
  }
  getToday(): void {
    this.calendarComponent.getApi().today();
    this.updateViewDates();
  }
  weekView() {
    this.calendarComponent.getApi().changeView('timeGridWeek');
    this.updateViewDates();
  }
  monthView() {
    this.calendarComponent.getApi().changeView('dayGridMonth');
    this.updateViewDates();
  }
  dayView() {
    this.calendarComponent.getApi().changeView('timeGridDay');
    this.updateViewDates();
  }

  ngOnDestroy(): void {
    if (this.mentorSubscription) {
      this.mentorSubscription.unsubscribe();
    }
  }
}
