import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, Observable, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.isInitialized$.pipe(
      filter(initialized => initialized),
      take(1),
      switchMap(() => this.authService.currentUser$.pipe(
        take(1),
        map(user => {
          if (user) return true;
          this.router.navigate(['/login']);
          return false;
        })
      ))
    );
  }
}
