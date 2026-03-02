import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlatformService } from './services/platform.service';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';
  maintenanceMode = false;
  maintenanceMessage = '';
  announcement = { enabled: false, message: '' };
  private maintenanceSub!: Subscription;

  constructor(private platformService: PlatformService) { }

  ngOnInit(): void {
    // Check maintenance status every 5 seconds for better responsiveness
    this.maintenanceSub = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.platformService.getMaintenanceStatus())
      )
      .subscribe({
        next: (res) => {
          this.maintenanceMode = res.maintenanceMode;
          this.maintenanceMessage = res.message;
          this.announcement = res.announcement || { enabled: false, message: '' };
        },
        error: (err) => {
          console.error('Error checking maintenance status:', err);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.maintenanceSub) {
      this.maintenanceSub.unsubscribe();
    }
  }
}
