import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService, Job } from '../../services/job.service';

@Component({
    selector: 'app-manage-job',
    templateUrl: './manage-job.component.html',
    styleUrls: ['./manage-job.component.css'],
    standalone: false
})
export class ManageJobComponent implements OnInit {
    job: Job | null = null;
    loading = true;
    saving = false;
    error = '';
    successMsg = '';

    // For applicant status update
    updatingApplicant: string | null = null;

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
            this.router.navigate(['/dashboard']);
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
                this.error = 'Failed to load job details.';
                this.loading = false;
            }
        });
    }

    setStatus(status: 'active' | 'closed') {
        if (!this.job || this.saving) return;
        this.saving = true;
        this.clearMessages();
        this.jobService.updateJob(this.job._id, { status }).subscribe({
            next: (res: any) => {
                this.job!.status = res.data.status;
                this.saving = false;
                this.successMsg = `Job marked as "${status}" successfully.`;
                this.autoClearSuccess();
            },
            error: () => {
                this.error = 'Failed to update status.';
                this.saving = false;
            }
        });
    }

    updateApplicantStatus(userId: string, status: string) {
        if (!this.job) return;
        this.updatingApplicant = userId;
        this.clearMessages();
        this.jobService.updateApplicationStatus(this.job._id, userId, status).subscribe({
            next: () => {
                // Optimistically update locally
                const applicant = this.job!.applicants?.find((a: any) => a.user._id === userId);
                if (applicant) applicant.status = status;
                this.updatingApplicant = null;
                this.successMsg = 'Applicant status updated.';
                this.autoClearSuccess();
            },
            error: () => {
                this.error = 'Failed to update applicant status.';
                this.updatingApplicant = null;
            }
        });
    }

    deleteJob() {
        if (!this.job) return;
        if (!confirm('Are you sure you want to permanently delete this job? This cannot be undone.')) return;
        this.jobService.deleteJob(this.job._id).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: () => { this.error = 'Failed to delete job.'; }
        });
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    getStatusLabel(status: string): string {
        const map: any = { pending: '⏳ Pending', shortlisted: '⭐ Shortlisted', accepted: '✅ Accepted', rejected: '❌ Rejected' };
        return map[status] || status;
    }

    getApplicantStatusClass(status: string): string {
        const map: any = { pending: 'apl-pending', shortlisted: 'apl-shortlisted', accepted: 'apl-accepted', rejected: 'apl-rejected' };
        return map[status] || 'apl-pending';
    }

    clearMessages() { this.error = ''; this.successMsg = ''; }

    autoClearSuccess() {
        setTimeout(() => { this.successMsg = ''; }, 3500);
    }
}
