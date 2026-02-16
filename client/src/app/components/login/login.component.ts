import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.redirectIfAuth();
  }

  private redirectIfAuth() {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        if (user.role === 'user') {
          this.router.navigate(['/jobs']);
        }
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    // Unified login - no role selection needed
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        const role = res.data.role;

        // Redirect based on role
        if (role === 'admin') {
          window.location.href = 'http://localhost:4200'; // Admin frontend
        } else {
          this.router.navigate(['/jobs']); // User goes to jobs
        }
      },
      error: (err: any) => {
        this.error = err.error.message || 'Login failed';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
