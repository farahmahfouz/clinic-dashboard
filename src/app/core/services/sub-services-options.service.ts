import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

export interface ServiceOption {
  _id: string;
  name?: string;
  subService?: string | { _id: string; name: string };
  slug?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class SubServicesOptionsService {
  constructor(private http: HttpClient) {}

  getOptionsBySubServiceId(subServiceId: string): Observable<ServiceOption[]> {
    return this.http
      .get<{ data: { options: ServiceOption[] } }>(`sub-service/${subServiceId}/services`)
      .pipe(map((res) => res.data?.options ?? []));
  }

  getOptionsBySlug(slug: string): Observable<ServiceOption[]> {
    return this.http
      .get<{ data: { options: ServiceOption[] } }>(`sub-service/${slug}/services`)
      .pipe(map((res) => res.data?.options ?? []));
  }

  /** Get options: pass either subServiceId or slug */
  getOptions(params: { subServiceId?: string; slug?: string }): Observable<ServiceOption[]> {
    if (params.subServiceId) return this.getOptionsBySubServiceId(params.subServiceId);
    if (params.slug) return this.getOptionsBySlug(params.slug);
    return of([]);
  }
}
