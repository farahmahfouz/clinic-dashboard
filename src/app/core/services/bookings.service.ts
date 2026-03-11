import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface BookingUser {
  _id: string;
  name: string;
  phone: string;
}

export interface BookingDoctor {
  _id: string;
  name: string;
}

export interface BookingServiceItem {
  serviceOption: any | null;
  price: number;
  _id: string;
}

export interface Booking {
  _id: string;
  timeSlot: { start: string; end: string };
  user: BookingUser;
  doctor: BookingDoctor;
  services: BookingServiceItem[];
  totalPrice: number;
  dateOfService: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private http: HttpClient) { }

  // Existing settings helpers (used in SettingsComponent)
  getSettings() {
    return this.http.get<any>('settings').pipe(
      map(res => res.data.settings)
    );
  }

  updateSettings(data: any, id: string) {
    return this.http.patch<any>(`settings/${id}`, data).pipe(
      map(res => res.data.settings)
    );
  }

  /** GET booking — optional query: status, sort, page, limit. Returns list + total for pagination. */
  getAllBookings(params?: {
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Observable<{ bookings: Booking[]; total: number }> {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.sort) q.set('sort', params.sort);
    if (params?.page) q.set('page', params.page.toString());
    if (params?.limit) q.set('limit', params.limit.toString());
    const query = q.toString();
    const url = query ? `booking?${query}` : 'booking';

    return this.http.get<{ data: { bookings: Booking[] }, totalCount?: number }>(url).pipe(
      map(res => {
        const bookings = res.data?.bookings ?? [];
        const total = res.totalCount ?? 0;
        return { bookings, total };
      })
    );
  }

  // New: load bookings for specific doctor using route: user/:doctorId/bookings
  getDoctorBookings(doctorId: string): Observable<Booking[]> {
    return this.http
      .get<{ data: { bookings: Booking[] } }>(`user/${doctorId}/bookings`)
      .pipe(map(res => res.data.bookings));
  }

  /** PATCH booking/:id — e.g. update status to completed/confirmed */
  updateBooking(id: string, data: { status?: string }): Observable<Booking> {
    return this.http
      .patch<{ data: { booking: Booking } }>(`booking/${id}`, data)
      .pipe(map(res => res.data.booking));
  }

  /** DELETE booking/:id — cancel booking */
  cancelBooking(id: string): Observable<void> {
    return this.http.delete<void>(`booking/${id}`);
  }
}
