import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  Reservation,
  reservationForMentorDTO,
  Slot,
  SlotDTO,
  SlotFormated,
} from '../models/reservation';
import { BehaviorSubject, Observable, Subject, switchMap, tap } from 'rxjs';
import { ReservationForStudentDTO } from '../models/reservation';
import { MentorService } from './mentor.service';
import { StudentService } from './student.service';
import { PaginationService } from './pagination.service';
import { EventInput } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  httpClient = inject(HttpClient);
  pagination = inject(PaginationService);

  activeMentorReservations$: BehaviorSubject<{
    reservations: reservationForMentorDTO[];
    total: number;
  }> = new BehaviorSubject({
    reservations: [] as reservationForMentorDTO[],
    total: 0,
  });

  activeMentorReservationsHistory$: BehaviorSubject<{
    reservations: reservationForMentorDTO[];
    total: number;
  }> = new BehaviorSubject({
    reservations: [] as reservationForMentorDTO[],
    total: 0,
  });

  activeStudentReservations$: BehaviorSubject<{
    reservations: ReservationForStudentDTO[];
    total: number;
  }> = new BehaviorSubject({
    reservations: [] as ReservationForStudentDTO[],
    total: 0,
  });

  activeStudentReservationsHistory$: BehaviorSubject<{
    reservations: ReservationForStudentDTO[];
    total: number;
  }> = new BehaviorSubject({
    reservations: [] as ReservationForStudentDTO[],
    total: 0,
  });

  activeMentorSlots = new BehaviorSubject<EventInput[]>([]);
  activeStudentSlots = new BehaviorSubject<EventInput[]>([]);

  MentorViewDateStart = new BehaviorSubject<Date>(new Date());
  MentorViewDateEnd = new BehaviorSubject<Date>(new Date());

  mentorService = inject(MentorService);
  studentService = inject(StudentService);

  constructor() {}

  addSlotToMentor(
    slotInfo: any,
    dateBegin: Date,
    dateEnd: Date
  ): Observable<any> {
    const formattedSlotInfo: any = {
      dateBegin: slotInfo.dateBegin,
      dateEnd: slotInfo.dateEnd,
      visio: slotInfo.visio,
      mentorId: slotInfo.mentorId,
    };
    console.log('formatted slot ', formattedSlotInfo);

    return this.httpClient
      .post(`${environment.BASE_URL_API}/user/slot/add`, formattedSlotInfo)
      .pipe(
        switchMap(() =>
          this.getSlotsForMentor(slotInfo.mentorId, dateBegin, dateEnd)
        )
      );
  }

  getSlotsForMentor(
    mentorId: number,
    dateBegin: Date,
    dateEnd: Date
  ): Observable<SlotDTO[]> {
    return this.httpClient
      .post<SlotDTO[]>(
        `${environment.BASE_URL_API}/user/slot/get/${mentorId}`,
        {
          start: dateBegin,
          end: dateEnd,
        }
      )
      .pipe(
        tap((res) => {
          this.activeMentorSlots.next(this.formatSlotsToEvents(res));
        })
      );
  }

  getSlotsforStudentByMentorId(
    mentorId: number,
    dateBegin: Date,
    dateEnd: Date
  ): Observable<SlotDTO[]> {
    const studentId = this.studentService.activeStudentProfil$.value.id;
    return this.httpClient
      .post<SlotDTO[]>(
        `${environment.BASE_URL_API}/user/slot/slots/${mentorId}/${studentId}`,
        { start: dateBegin, end: dateEnd }
      )
      .pipe(
        tap((res) => {
          this.activeStudentSlots.next(this.formatStudentSlotsToEvents(res));
          console.log('slots for student ', res);
          console.log(
            'slots for student formatted ',
            this.formatStudentSlotsToEvents(res)
          );
        })
      );
  }

  deleteSlot(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.BASE_URL_API}/user/slot/delete/${id}`
    );
  }

  formatSlotsToEvents(slots: SlotDTO[]): EventInput[] {
    return slots.map((slot) => ({
      id: '' + slot.id,
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

  formatStudentSlotsToEvents(slots: SlotDTO[]): EventInput[] {
    return slots.map((slot) => ({
      id: '' + slot.id,
      title: slot.visio ? 'Visio' : 'Présentiel',
      start: slot.dateBegin,
      end: slot.dateEnd,

      color:
        slot.reservationId !== null
          ? '#447597'
          : slot.visio
          ? '#FCBE77'
          : '#F8156B',
      className: slot.booked ? 'booked' : 'not-booked',

      extendedProps: {
        slotId: slot.id,
        mentorId: slot.mentorId,
        reservationId: slot.reservationId,
        isBooked: !!slot.reservationId,
      },
    }));
  }

  updateSlot(id: number, slotInfo: SlotFormated): Observable<SlotDTO> {
    const updatedSlotInfo = {
      id: id,
      dateBegin: slotInfo.dateBegin,
      dateEnd: slotInfo.dateEnd,
      visio: slotInfo.visio,
      mentorId: slotInfo.mentorId,
    };

    return this.httpClient.put<SlotDTO>(
      `${environment.BASE_URL_API}/user/slot/update`,
      updatedSlotInfo
    );
  }

  getMentorReservationList(perPage: number, offset: number) {
    const mentorId = this.mentorService.activeMentorProfil$.value.id;
    return this.httpClient
      .get<{
        reservations: reservationForMentorDTO[];
        total: number;
      }>(
        environment.BASE_URL_API +
          `/reservation/get/mentor/upcoming/${mentorId}/${perPage}/${offset}`
      )
      .pipe(
        tap((res) => {
          console.log('reservations list ', res);

          this.activeMentorReservations$.next(res);
        })
      );
  }

  getMentorReservationHistoryList(perPage: number, offset: number) {
    const mentorId = this.mentorService.activeMentorProfil$.value.id;
    return this.httpClient
      .get<{ reservations: reservationForMentorDTO[]; total: number }>(
        environment.BASE_URL_API +
          `/reservation/get/mentor/history/${mentorId}/${perPage}/${offset}`
      )
      .pipe(
        tap((res) => {
          this.activeMentorReservationsHistory$.next(res);
        })
      );
  }

  updateMentorReservationHistoryList(
    id: number,
    userId: number,
    message: string
  ) {
    const mentorId = this.mentorService.activeMentorProfil$.value.id;
    return this.httpClient
      .put<{ reservations: reservationForMentorDTO[]; total: number }>(
        environment.BASE_URL_API +
          `/reservation/update/${id}/${this.pagination.offsetReservationMentorHistory.value}`,
        {
          message,
          mentorId,
        }
      )
      .pipe(
        tap((res) => {
          this.activeMentorReservationsHistory$.next(res);
        })
      );
  }

  getStudentReservationList(perPage: number, offset: number) {
    const studentId = this.studentService.activeStudentProfil$.value.id;
    return this.httpClient
      .get<{
        reservations: ReservationForStudentDTO[];
        total: number;
      }>(
        environment.BASE_URL_API +
          `/reservation/get/student/upcoming/${studentId}/${perPage}/${offset}`
      )
      .pipe(
        tap((res) => {
          this.activeStudentReservations$.next(res);
        })
      );
  }

  getStudentReservationHistoryList(perPage: number, offset: number) {
    const studentId = this.studentService.activeStudentProfil$.value.id;

    return this.httpClient
      .get<{ reservations: ReservationForStudentDTO[]; total: number }>(
        environment.BASE_URL_API +
          `/reservation/get/student/history/${studentId}/${perPage}/${offset}`
      )
      .pipe(
        tap((res) => {
          this.activeStudentReservationsHistory$.next(res);
        })
      );
  }

  removeMentorReservation(
    reservationId: number,
    mentorId: number,
    first: number
  ): Observable<{
    reservations: reservationForMentorDTO[];
    total: number;
  }> {
    const total = this.activeMentorReservations$.value.total;

    return this.httpClient
      .delete<{ reservations: reservationForMentorDTO[]; total: number }>(
        environment.BASE_URL_API +
          `/reservation/delete/mentor/reservation/${reservationId}`
      )
      .pipe(
        switchMap(() => {
          if (total % 5 === 1 && total > 5 && first > 5) {
            this.pagination.offsetReservationStudent.next(
              this.pagination.offsetReservationStudent.value - 1
            );
            return this.getMentorReservationList(5, first - 5);
          }
          return this.getMentorReservationList(5, first);
        })
      );
  }

  removeReservationByStudent(
    reservationId: number,
    studentId: number,
    first: number
  ): Observable<{
    reservations: ReservationForStudentDTO[];
    total: number;
  }> {
    const total = this.activeStudentReservations$.value.total;

    return this.httpClient
      .delete<{ reservations: ReservationForStudentDTO[]; total: number }>(
        environment.BASE_URL_API +
          `/reservation/delete/student/${reservationId}`
      )
      .pipe(
        switchMap(() => {
          if (total % 5 === 1 && total > 5) {
            this.pagination.offsetReservationStudent.next(
              this.pagination.offsetReservationStudent.value - 1
            );
            return this.getStudentReservationList(5, first - 5);
          }
          return this.getStudentReservationList(5, first);
        })
      );
  }

  bookSlot(
    slotId: number,
    studentId: number,
    subject: string,
    details: string
  ) {
    const newReservation: Reservation = {
      slotId: slotId,
      studentId: studentId,
      subject: subject,
      details: details,
    };

    return this.httpClient.post<Reservation>(
      environment.BASE_URL_API + '/reservation/add',
      newReservation
    );
  }
}
