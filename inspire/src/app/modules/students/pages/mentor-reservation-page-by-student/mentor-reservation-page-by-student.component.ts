import {
  AfterViewChecked,
  Component,
  DestroyRef,
  Inject,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction';
import { Observable, Subscription, map, switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReservationService } from '../../../../shared/services/reservation.service';
import { MentorDTO } from '../../../../shared/models/user';
import { ActivatedRoute } from '@angular/router';
import { Reservation, SlotDTO } from '../../../../shared/models/reservation';
import { StudentService } from '../../../../shared/services/student.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-mentor-reservation-by-student',
  templateUrl: './mentor-reservation-page-by-student.component.html',
  styleUrl: './mentor-reservation-page-by-student.component.scss',
})
export class MentorReservationPageByStudentComponent implements OnInit {
  today!: string;
  visible = false;
  mentorId!: number;
  events: EventInput[] = [];
  displayModal: boolean = false;
  profil!: Observable<MentorDTO>;
  eventDetails!: Reservation;
  studentService = inject(StudentService);
  destroyRef = inject(DestroyRef);
  subject = 'Autre';
  details = '';

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
      .getSlotsforStudentByMentorId(mentorId)
      .subscribe((slots) => {
        this.events = this.formatSlotsToEvents(slots).filter(
          (ele) => !ele['booked']
        );
      });
  }

  formatSlotsToEvents(slots: SlotDTO[]): EventInput[] {
    return slots.map((slot) => ({
      id: '' + slot.id,
      title: slot.visio ? 'Visio' : 'Présentiel',
      start: slot.dateBegin,
      end: slot.dateEnd,

      color: slot.booked ? '#A4A4A2' : slot.visio ? '#FCBE77' : '#F8156B',
      className: slot.booked ? 'booked' : 'not-booked',

      extendedProps: {
        slotId: slot.id,
        mentorId: slot.mentorId,
        reservationId: slot.reservationId,
        isBooked: !!slot.reservationId,
      },
    }));
  }

  bookSlot() {
    this.reservationService
      .bookSlot(
        this.eventDetails.slotId,
        this.eventDetails.studentId,
        this.subject,
        this.details
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(
        switchMap(() => {
          const mentorId = this.mentorId;
          return this.reservationService.getSlotsforStudentByMentorId(mentorId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((slots) => {
        this.events = this.formatSlotsToEvents(slots).filter(
          (ele) => !ele['booked']
        );
        (this.subject = 'Autre'), (this.details = '');
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
        this.loadSlots();
      })
    );
  }

  setSubject(event: Event) {}
}
