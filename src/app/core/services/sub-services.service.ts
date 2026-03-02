import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';

export interface ServiceSummary {
  _id: string;
  name: string;
}

export interface SubServices {
  _id: string;
  name: string;
  slug?: string;
  service: ServiceSummary;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubServicesService {
  private subServicesSubject = new BehaviorSubject<SubServices[]>([]);
  subServices$ = this.subServicesSubject.asObservable();
  constructor(private http: HttpClient) { }

  loadSubServices() {
    return this.http.get<any>('sub-service').pipe(
      map(res => res.data.subServices),
      tap(subServices => this.subServicesSubject.next(subServices))
    )
  }

  addSubService(data: SubServices) {
    return this.http.post<any>('sub-service', data).pipe(
      map(res => res.data.subService),
      tap(subservices => {
        const current = this.subServicesSubject.value;
        this.subServicesSubject.next([subservices, ...current])
      })
    )
  }

  editSubService(data: any, id: string) {
    return this.http.patch<any>(`sub-service/${id}`, data).pipe(
      map(res => res.data.subService),
      tap(newService => {
        const current = this.subServicesSubject.value;
        const updatedList = current.map(subService => subService._id === id ? newService : subService);
        this.subServicesSubject.next(updatedList);
      })
    )
  }

  deleteSubService(id: string) {
    return this.http.delete<any>(`sub-service/${id}`).pipe(
      tap(() => {
        const current = this.subServicesSubject.value;
        const updated = current.filter(s => s._id !== id);
        this.subServicesSubject.next(updated);
      })
    );
  }
}
