import {
  AfterViewInit,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction';
import { Observable, first, map, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { MentorDTO } from '../../../../../shared/models/user';
import { Reservation } from '../../../../../shared/models/reservation';
import { StudentService } from '../../../../../shared/services/student.service';
import { ReservationService } from '../../../../../shared/services/reservation.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-agenda-student',
  templateUrl: './agenda-student.component.html',
  styleUrl: './agenda-student.component.scss',
})
export class AgendaStudentComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;
  visible = false;
  mentorId!: number;
  events: EventInput[] = [];
  displayModal: boolean = false;
  profil!: Observable<MentorDTO>;
  eventDetails!: Reservation;
  studentService = inject(StudentService);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  subject = 'Autre';
  details = '';
  period!: string;
  events$ = this.reservationService.activeStudentSlots;
  today = signal('');
  dateStart!: Date;
  dateEnd!: Date;
  currentDate!: Date;

  constructor(
    private reservationService: ReservationService,
    private activatedRouter: ActivatedRoute
  ) {}

  eventAllow = (dropInfo: any, draggedEvent: any) => {
    return false;
  };

  selectAllow = () => {
    return false;
  };

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    events: [],
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
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      list: 'list',
      allDayText: 'tous',
    },

    weekends: true,
    slotDuration: '00:15:00',
    slotMinTime: '09:00',
    slotMaxTime: '19:00',
    allDaySlot: false,

    navLinks: true,
    eventStartEditable: true,

    weekNumbers: true,
    selectMirror: true,
    unselectAuto: true,
    selectOverlap: false,
    editable: false,
    selectable: true,
    eventDurationEditable: false,
    defaultTimedEventDuration: '01:00:00',
    nowIndicator: true,

    droppable: false,
    eventContent: this.renderEventContent.bind(this),

    selectAllow: this.selectAllow,
    eventClick: this.handleEventClick.bind(this),
    eventAllow: this.eventAllow.bind(this),
  };

  renderEventContent(arg: any) {
    let html = `<div class="custom-event">
                  <b>${arg.event.title}</b>
                  <div>${
                    arg.event.extendedProps['isBooked']
                      ? 'Créneau réservé'
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
    if (eventClickArg.event.extendedProps['isBooked']) return;
    this.eventDetails = {
      slotId: eventClickArg.event.extendedProps['slotId'],
      studentId: this.studentService.activeStudentProfil$.value.id,
      subject: this.subject,
      details: this.details,
    };
    this.visible = true;
  }

  loadSlots(): void {
    const mentorId = this.mentorId;
    this.reservationService
      .getSlotsforStudentByMentorId(mentorId, this.dateStart, this.dateEnd)
      .pipe(first())
      .subscribe();
  }

  bookSlot() {
    this.reservationService
      .bookSlot(
        this.eventDetails.slotId,
        this.eventDetails.studentId,
        this.subject,
        this.details
      )
      .pipe(
        switchMap(() => {
          const mentorId = this.mentorId;
          return this.reservationService.getSlotsforStudentByMentorId(
            mentorId,
            this.dateStart,
            this.dateEnd
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Super ! ',
          detail: 'Votre créneau a bien été réservé',
        });
      });
    this.visible = false;
  }

  ngOnInit(): void {
    this.calendarOptions.locale = frLocale;
    this.calendarOptions.allDayText = 'Heures';
    this.profil = this.activatedRouter.data.pipe(
      map((data) => data['profil']),
      tap((res) => {
        this.mentorId = res.id;
      })
    );
  }

  ngAfterViewInit(): void {
    this.updateViewDates();
    this.loadSlots();
    setTimeout(() => {
      this.today = signal('today');
    }, 10);
  }

  handleDatesSet(arg: any) {
    this.updateViewDates();
  }

  updateViewDates() {
    const calendarApi = this.calendarComponent.getApi();
    this.dateStart = calendarApi.view.currentStart;
    this.dateEnd = calendarApi.view.currentEnd;
    this.currentDate = calendarApi.getDate();
    this.period = this.calendarComponent.getApi().view.title;
    this.loadSlots();
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

  setSubject(event: Event) {}
}
