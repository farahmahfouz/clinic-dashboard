import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Slot {
  start: string;
  end: string;
}

export interface Availability {
  day: string;
  slots: Slot[];
}

export interface DoctorSchedule {
  _id?: string;
  doctor: string;
  daysOff: string[];
  availability: Availability[];
  isActive?: boolean;
  createdAt?: string;
}


@Injectable({
  providedIn: 'root'
})
export class DoctorSchedualService {

   constructor(private http: HttpClient) {}

  /** GET doctor-schedule — optional query: search, sort */
  getSchedules(params?: { search?: string; sort?: string }): Observable<any> {
    let url = 'doctor-schedule';
    if (params?.search || params?.sort) {
      const q = new URLSearchParams();
      if (params.search) q.set('search', params.search);
      if (params.sort) q.set('sort', params.sort);
      url += '?' + q.toString();
    }
    return this.http.get<any>(url);
  }

  // ✅ Get One By Doctor Id
  getScheduleByDoctor(doctorId: string): Observable<any> {
    return this.http.get<any>(`${'doctor-schedule'}/${doctorId}`);
  }

  // ✅ Create
  addSchedule(data: DoctorSchedule): Observable<any> {
    return this.http.post<any>('doctor-schedule', data);
  }

  // ✅ Update
  updateSchedule(id: string, data: DoctorSchedule): Observable<any> {
    return this.http.patch<any>(`${'doctor-schedule'}/${id}`, data);
  }

  // ✅ Delete
  deleteSchedule(id: string): Observable<any> {
    return this.http.delete<any>(`${'doctor-schedule'}/${id}`);
  }
}
