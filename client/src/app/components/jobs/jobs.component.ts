import { Component, OnInit } from '@angular/core';
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

    constructor(private jobService: JobService) { }

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
        this.jobService.applyToJob(jobId, {}).subscribe({
            next: () => {
                alert('Application submitted successfully!');
                this.fetchJobs(); // Refresh to show application status
            },
            error: (err: any) => {
                alert(err.error.message || 'Failed to apply');
            }
        });
    }
}
