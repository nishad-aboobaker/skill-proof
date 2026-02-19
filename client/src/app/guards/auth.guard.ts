import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    // Check if a user is currently logged in
    const user = this.authService.userValue;

    if (user) {
      return true; // Allow access to the page
    } else {
      this.router.navigate(['/login']); // Send to login if not logged in
      return false;
    }
  }
}
