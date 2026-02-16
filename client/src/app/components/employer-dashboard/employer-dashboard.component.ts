import { Component, OnInit } from '@angular/core';
import { JobService, Job } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-employer-dashboard',
    templateUrl: './employer-dashboard.component.html',
    styleUrls: ['./employer-dashboard.component.css'],
    standalone: false
})
export class EmployerDashboardComponent implements OnInit {
    postedJobs: Job[] = [];
    myApplications: any[] = [];
    loading = true;
    error = '';
    userName = '';

    constructor(
        private jobService: JobService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.userName = this.authService.userValue?.name || 'User';
        this.fetchDashboardData();
    }

    fetchDashboardData() {
        this.loading = true;

        // Fetch both posted jobs and applications in parallel
        Promise.all([
            this.jobService.getMyPostedJobs().toPromise(),
            this.jobService.getMyApplications().toPromise()
        ]).then(([postedRes, appRes]: any) => {
            this.postedJobs = postedRes.data;
            this.myApplications = appRes.data;
            this.loading = false;
        }).catch(err => {
            this.error = 'Failed to load dashboard data';
            this.loading = false;
        });
    }

    getStats() {
        return [
            { label: 'Active Postings', value: this.postedJobs.length.toString(), icon: '📝' },
            { label: 'Total Applications', value: this.myApplications.length.toString(), icon: '👥' },
            { label: 'Pending Response', value: this.myApplications.filter(a => a.myApplicationStatus === 'pending').length.toString(), icon: '⏳' },
            { label: 'Shortlisted', value: this.myApplications.filter(a => a.myApplicationStatus === 'shortlisted').length.toString(), icon: '⭐' }
        ];
    }
}
