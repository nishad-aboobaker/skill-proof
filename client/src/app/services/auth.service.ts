import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

// The shape of a logged-in user
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

  // Stores the currently logged-in user (null if not logged in)
  private currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    // When the app starts, check if the user is already logged in
    this.checkStatus();
  }

  // Register a new user
  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => this.currentUser.next(res.data))
    );
  }

  // Log in an existing user
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => this.currentUser.next(res.data))
    );
  }

  // Log out the current user
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.currentUser.next(null))
    );
  }

  // Ask the server if the user is still logged in (uses session cookie)
  checkStatus() {
    this.http.get(`${this.apiUrl}/me`).subscribe({
      next: (res: any) => this.currentUser.next(res.data),
      error: () => this.currentUser.next(null)
    });
  }

  // Get the current user's data directly (without subscribing)
  get userValue(): User | null {
    return this.currentUser.value;
  }

  // Quick check: is the current user an admin?
  get isAdmin(): boolean {
    return this.currentUser.value?.role === 'admin';
  }
}
