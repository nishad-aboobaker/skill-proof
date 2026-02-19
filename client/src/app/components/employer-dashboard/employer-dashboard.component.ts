import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-employer-dashboard',
    templateUrl: './employer-dashboard.component.html',
    styleUrls: ['./employer-dashboard.component.css'],
    standalone: false
})
export class EmployerDashboardComponent implements OnInit {
    // Data from the server
    postedJobs: any[] = [];
    myApplications: any[] = [];

    // Page state
    loading = true;
    error = '';
    userName = '';

    constructor(private jobService: JobService, private authService: AuthService) { }

    ngOnInit() {
        // Get the logged-in user's name
        this.userName = this.authService.userValue?.name || 'User';
        this.loadData();
    }

    loadData() {
        this.loading = true;

        // Load posted jobs
        this.jobService.getMyPostedJobs().subscribe({
            next: (res: any) => {
                this.postedJobs = res.data;
            },
            error: () => {
                this.error = 'Failed to load posted jobs';
            }
        });

        // Load my job applications
        this.jobService.getMyApplications().subscribe({
            next: (res: any) => {
                this.myApplications = res.data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Failed to load applications';
                this.loading = false;
            }
        });
    }

    // Count how many applications have a given status
    countByStatus(status: string): number {
        return this.myApplications.filter(a => a.myApplicationStatus === status).length;
    }

    // Count all applicants received across all posted jobs
    totalApplicantsReceived(): number {
        return this.postedJobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
    }
}
