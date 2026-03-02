import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Service } from '../../features/services/services.component';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  private servicesSubject = new BehaviorSubject<Service[]>([]);
  services$ = this.servicesSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadServices(sort?: string, search?: string) {

    let params = new HttpParams();
    if (sort) {
      params = params.set('sort', sort);
    }
    if (search) {
      params = params.set('search', search)
    }

    return this.http.get<any>('service', { params }).pipe(
      map(res => res.data.services),
      tap(services => this.servicesSubject.next(services))
    );
  }

  addService(data: any) {
    return this.http.post<any>('service', data).pipe(
      map(res => res.data.service),
      tap(newService => {
        const current = this.servicesSubject.value;
        this.servicesSubject.next([newService, ...current]);
      })
    )
  }

  editService(data: any, id: string) {
    return this.http.patch<any>(`service/${id}`, data).pipe(
      map(res => res.data.service),
      tap(newService => {
        const current = this.servicesSubject.value;
        const updatedList = current.map(service => service._id === id ? newService : service);
        this.servicesSubject.next(updatedList);
      })
    )
  }

  deleteService(id: string){
    return this.http.delete<any>(`service/${id}`)
  }
}
