import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent {

  constructor(public authService: AuthService) { }

  // True if someone is logged in
  get isLoggedIn(): boolean {
    return !!this.authService.userValue;
  }
}
