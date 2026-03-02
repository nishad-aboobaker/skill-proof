import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  // Form fields
  email = '';
  password = '';

  // Page state
  loading = false;
  error = '';

  private returnUrl = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Capture the return URL from query params (set by AuthGuard)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

    // If the user is already logged in, redirect them
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.redirectAfterLogin(user.role);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.redirectAfterLogin(res.data.role);
      },
      error: (err: any) => {
        this.error = err.error.message || 'Login failed';
        this.loading = false;
      }
    });
  }

  private redirectAfterLogin(role: string) {
    if (role === 'admin') {
      window.location.href = 'http://localhost:4200';
      return;
    }

    // If we have a return URL, go back to where the user was trying to go
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      // Default: employer → dashboard, job seeker → jobs
      this.router.navigate(['/dashboard']);
    }
  }
}
