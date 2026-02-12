import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profile?: {
    github?: any;
    resume?: any;
    skills?: string[];
    experience?: string;
    bio?: string;
    portfolio?: string;
    companyName?: string;
    companyWebsite?: string;
    companySize?: string;
    industry?: string;
    companyLogo?: string;
    companyDescription?: string;
  };
  postedJobs?: string[];
  appliedJobs?: string[];
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

  constructor(private http: HttpClient) {
    this.checkStatus();
  }

  // Unified registration (no role selection needed)
  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => this.currentUserSubject.next(res.data))
    );
  }

  // Unified login (no role selection needed)
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
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

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
}
