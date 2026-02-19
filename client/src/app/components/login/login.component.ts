import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // If the user is already logged in, send them to the jobs page
    this.authService.currentUser$.subscribe(user => {
      if (user) this.router.navigate(['/jobs']);
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        const role = res.data.role;
        if (role === 'admin') {
          window.location.href = 'http://localhost:4200';
        } else {
          this.router.navigate(['/jobs']);
        }
      },
      error: (err: any) => {
        this.error = err.error.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
