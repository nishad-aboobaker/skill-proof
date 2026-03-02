import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';

@Component({
    selector: 'app-my-posted-jobs',
    templateUrl: './my-posted-jobs.component.html',
    styleUrls: ['./my-posted-jobs.component.css'],
    standalone: false
})
export class MyPostedJobsComponent implements OnInit {
    jobs: any[] = [];
    loading = true;
    error = '';

    constructor(private jobService: JobService) { }

    ngOnInit() {
        this.fetchMyJobs();
    }

    fetchMyJobs() {
        this.loading = true;
        this.error = '';
        this.jobService.getMyPostedJobs().subscribe({
            next: (res: any) => {
                this.jobs = res.data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Failed to load your posted jobs.';
                this.loading = false;
            }
        });
    }

    getCurrencySymbol(currency: string): string {
        const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };
        return symbols[currency] || currency;
    }

    deleteJob(id: string) {
        if (!confirm('Are you sure you want to delete this job posting?')) return;
        this.jobService.deleteJob(id).subscribe({
            next: () => {
                this.jobs = this.jobs.filter(j => j._id !== id);
            },
            error: () => {
                this.error = 'Failed to delete job.';
            }
        });
    }
}
