import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
})
export class RegisterComponent {
  // Form fields
  name = '';
  email = '';
  password = '';

  // Page state
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  // Check if all fields are filled and valid
  isFormValid(): boolean {
    return this.name.trim() !== '' &&
      this.email.includes('@') &&
      this.password.length >= 8;
  }

  // Password helper checks
  hasMinLength(): boolean { return this.password.length >= 8; }
  hasUppercase(): boolean { return /[A-Z]/.test(this.password); }
  hasLowercase(): boolean { return /[a-z]/.test(this.password); }
  hasNumber(): boolean { return /\d/.test(this.password); }
  hasSpecial(): boolean { return /[@$!%*?&]/.test(this.password); }

  onSubmit() {
    if (!this.isFormValid()) return;

    this.loading = true;
    this.error = '';

    const formData = { name: this.name, email: this.email, password: this.password };

    this.authService.register(formData).subscribe({
      next: (res: any) => {
        const role = res.data.role;
        if (role === 'admin') {
          window.location.href = 'http://localhost:4200';
        } else {
          this.router.navigate(['/jobs']);
        }
      },
      error: (err: any) => {
        this.error = err.error.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
