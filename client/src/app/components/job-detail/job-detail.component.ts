import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService, Job } from '../../services/job.service';

@Component({
    selector: 'app-job-detail',
    templateUrl: './job-detail.component.html',
    styleUrls: ['./job-detail.component.css'],
    standalone: false
})
export class JobDetailComponent implements OnInit {
    job: Job | null = null;
    loading = true;
    error = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private jobService: JobService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadJob(id);
        } else {
            this.router.navigate(['/jobs']);
        }
    }

    loadJob(id: string) {
        this.loading = true;
        this.jobService.getJobById(id).subscribe({
            next: (res: any) => {
                this.job = res.data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Could not load job details. It may have been removed.';
                this.loading = false;
            }
        });
    }

    applyNow() {
        if (this.job) {
            this.router.navigate(['/assessment', this.job._id]);
        }
    }

    goBack() {
        this.router.navigate(['/jobs']);
    }

    getCurrencySymbol(code: string): string {
        const symbols: { [key: string]: string } = {
            'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥'
        };
        return symbols[code] || code;
    }
}
