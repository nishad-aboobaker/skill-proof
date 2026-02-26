import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService, Job } from '../../services/job.service';

@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.css'],
    standalone: false
})
export class JobsComponent implements OnInit {
    jobs: Job[] = [];
    loading = true;
    error = '';

    constructor(private jobService: JobService, private router: Router) { }

    ngOnInit() {
        this.fetchJobs();
    }

    fetchJobs() {
        this.loading = true;
        this.jobService.getJobs().subscribe({
            next: (res: any) => {
                this.jobs = res.data;
                this.loading = false;
            },
            error: (err: any) => {
                this.error = 'Failed to load jobs';
                this.loading = false;
            }
        });
    }

    applyToJob(jobId: string) {
        this.router.navigate(['/assessment', jobId]);
    }

    getCurrencySymbol(code: string): string {
        const symbols: { [key: string]: string } = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'INR': '₹',
            'JPY': '¥'
        };
        return symbols[code] || code;
    }
}
