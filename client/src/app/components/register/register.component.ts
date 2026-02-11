import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  role: 'developer' | 'employer' = 'developer';
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // Role specific fields
      github: [''],
      companyName: ['']
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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.role = params['role'];
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    const data = this.registerForm.value;
    const registerObs = this.role === 'developer'
      ? this.authService.registerDeveloper(data)
      : this.authService.registerEmployer(data);

    registerObs.subscribe({
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
        this.error = err.error.message || 'Registration failed';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
