import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'employer' | 'developer';
  userType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isInitializedSubject = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitializedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkStatus();
  }

  registerDeveloper(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/developer/register`, data).pipe(
      tap((res: any) => this.currentUserSubject.next(res.data))
    );
  }

  registerEmployer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/employer/register`, data).pipe(
      tap((res: any) => this.currentUserSubject.next(res.data))
    );
  }

  loginDeveloper(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/developer/login`, data).pipe(
      tap((res: any) => this.currentUserSubject.next(res.data))
    );
  }

  loginAdminEmployer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin-employer/login`, data).pipe(
      tap((res: any) => this.currentUserSubject.next(res.data))
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
        this.currentUserSubject.next(res.data);
        this.isInitializedSubject.next(true);
      },
      error: () => {
        this.currentUserSubject.next(null);
        this.isInitializedSubject.next(true);
      }
    });
  }

  get userValue(): User | null {
    return this.currentUserSubject.value;
  }
}
