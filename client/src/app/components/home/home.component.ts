import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent {

  heroTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';

  constructor(public authService: AuthService) { }

  get isLoggedIn(): boolean {
    return !!this.authService.userValue;
  }

  onHeroMouseMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
    const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
    const rotX = (-dy * 6).toFixed(2);
    const rotY = (dx * 8).toFixed(2);
    this.heroTransform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
  }

  onHeroMouseLeave() {
    this.heroTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }
}
