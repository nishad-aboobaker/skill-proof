import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkStatus();
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin-employer/login`, data).pipe(
      tap((res: any) => {
        if (res.data.role === 'admin') {
          this.currentUserSubject.next(res.data);
        } else {
          throw new Error('Unauthorized');
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  checkStatus() {
    this.http.get(`${this.apiUrl}/me`).subscribe({
      next: (res: any) => {
        if (res.data.role === 'admin') {
          this.currentUserSubject.next(res.data);
        } else {
          this.currentUserSubject.next(null);
        }
      },
      error: () => this.currentUserSubject.next(null)
    });
  }

  get userValue(): User | null {
    return this.currentUserSubject.value;
  }
}
