import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private me$?: Observable<any>;
  user$ = new BehaviorSubject<any>(null);
  users$ = new BehaviorSubject<any>([]);

  constructor(private httpClient: HttpClient) { }

  login(data: any) {
    return this.httpClient.post<any>('user/login', data, {
      withCredentials: true
    }).pipe(
      tap(res => {
        this.user$.next(res.data.user);
      })
    )
  }

  getMe() {
    if (!this.me$) {
      this.me$ = this.httpClient.get<any>('user/me', {
        withCredentials: true
      }).pipe(
        map(res => res.data.user),
        tap(user => this.user$.next(user)),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }

    return this.me$;
  }

  getAllUsers(role?: string, sort?: string, search?: string): Observable<any[]> {

    let params = new HttpParams();

    if (role && role !== 'all') {
      params = params.set('role', role);
    }

    if (sort) {
      params = params.set('sort', sort);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.httpClient.get<any>('user', { params }).pipe(
      map(res => res.data.users),
      tap(users => this.users$.next(users))
    )
  }

  logout() {
    return this.httpClient.get('user/logout', {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.user$.next(null);
        this.me$ = undefined;
      })
    );
  }
}
