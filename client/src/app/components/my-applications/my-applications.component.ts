import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';

@Component({
    selector: 'app-my-applications',
    templateUrl: './my-applications.component.html',
    styleUrls: ['./my-applications.component.css'],
    standalone: false
})
export class MyApplicationsComponent implements OnInit {
    applications: any[] = [];
    loading = true;
    error = '';

    constructor(private jobService: JobService) { }

    ngOnInit(): void {
        this.loadApplications();
    }

    loadApplications(): void {
        this.loading = true;
        this.jobService.getMyApplications().subscribe({
            next: (res: any) => {
                this.applications = res.data;
                this.loading = false;
            },
            error: (err: any) => {
                this.error = 'Failed to load your applications. Please try again later.';
                this.loading = false;
            }
        });
    }

    getStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'pending': return 'badge-amber';
            case 'shortlisted': return 'badge-indigo';
            case 'accepted': return 'badge-green';
            case 'rejected': return 'badge-red';
            default: return 'badge-muted';
        }
    }

    getStatusLabel(status: string): string {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Pending ⏳';
            case 'shortlisted': return 'Shortlisted ⭐';
            case 'accepted': return 'Accepted ✅';
            case 'rejected': return 'Rejected';
            default: return 'Applied';
        }
    }
}
