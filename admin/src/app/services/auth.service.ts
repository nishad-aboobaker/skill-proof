import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isInitializedSubject = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitializedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkStatus();
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res.data.role === 'admin') {
          // Store token in localStorage (not cookie) to avoid collision with client app
          if (res.token) {
            localStorage.setItem('admin_token', res.token);
          }
          this.currentUserSubject.next(res.data);
        } else {
          throw new Error('Unauthorized');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    this.currentUserSubject.next(null);
    // Also call server to clear cookie for client app safety
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    this.router.navigate(['/login']);
  }

  checkStatus() {
    this.http.get(`${this.apiUrl}/me`).subscribe({
      next: (res: any) => {
        if (res.data.role === 'admin') {
          this.currentUserSubject.next(res.data);
        } else {
          this.currentUserSubject.next(null);
        }
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
