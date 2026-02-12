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
  userType: 'developer' | 'employer' = 'developer';
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
        if (user.role === 'developer') {
          this.router.navigate(['/jobs']);
        } else if (user.role === 'employer') {
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const loginObs = this.userType === 'developer'
      ? this.authService.loginDeveloper(this.loginForm.value)
      : this.authService.loginEmployer(this.loginForm.value);

    loginObs.subscribe({
      next: (res: any) => {
        const role = res.data.role;
        if (role === 'developer') {
          this.router.navigate(['/jobs']);
        } else if (role === 'employer') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
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
