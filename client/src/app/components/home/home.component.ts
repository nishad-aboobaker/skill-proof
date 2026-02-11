import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {
    this.redirectIfAuth();
  }

  private redirectIfAuth() {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        if (user.role === 'developer') {
          this.router.navigate(['/jobs']);
        } else if (user.role === 'employer') {
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
