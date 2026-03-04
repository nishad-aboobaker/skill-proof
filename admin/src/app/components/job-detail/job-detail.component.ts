import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../services/job.service';

declare var lucide: any;

@Component({
    selector: 'app-job-detail',
    templateUrl: './job-detail.component.html',
    styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit, AfterViewInit {
    jobId: string | null = null;
    job: any = null;
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private jobService: JobService
    ) { }

    ngOnInit(): void {
        this.jobId = this.route.snapshot.paramMap.get('id');
        if (this.jobId) {
            this.loadJobDetails(this.jobId);
        } else {
            this.router.navigate(['/manage-jobs']);
        }
    }

    ngAfterViewInit() {
        this.initIcons();
    }

    initIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadJobDetails(id: string) {
        this.loading = true;
        this.jobService.getJobById(id).subscribe({
            next: (res: any) => {
                this.job = res.data;
                this.loading = false;
                setTimeout(() => this.initIcons(), 0);
            },
            error: (err) => {
                console.error('Error fetching job details:', err);
                this.loading = false;
                this.router.navigate(['/manage-jobs']);
            }
        });
    }

    goBack() {
        this.router.navigate(['/manage-jobs']);
    }

    updateApplicantStatus(userId: string, status: string) {
        if (!this.jobId) return;

        // This is a placeholder for actual status update logic
        // The backend has updateApplicationStatus but we need to call it from service
        console.log(`Updating user ${userId} to status ${status}`);
        // For now, let's just update locally if the service doesn't have it yet
        // In a real app, you'd call a service method
    }
}
