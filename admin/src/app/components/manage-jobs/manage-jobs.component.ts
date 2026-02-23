import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JobService, Job } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

declare var lucide: any;

@Component({
    selector: 'app-manage-jobs',
    templateUrl: './manage-jobs.component.html',
    styleUrls: ['./manage-jobs.component.css']
})
export class ManageJobsComponent implements OnInit, AfterViewInit {
    jobs: Job[] = [];
    filteredJobs: Job[] = [];
    loading: boolean = true;
    searchQuery: string = '';

    constructor(
        private jobService: JobService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadJobs();
    }

    ngAfterViewInit() {
        this.initIcons();
    }

    initIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadJobs() {
        this.loading = true;
        this.jobService.getAllJobs(this.searchQuery).subscribe({
            next: (res: any) => {
                this.jobs = res.data;
                this.filteredJobs = this.jobs;
                this.loading = false;
                setTimeout(() => this.initIcons(), 0);
            },
            error: (err) => {
                console.error('Error fetching jobs:', err);
                this.loading = false;
            }
        });
    }

    onSearch() {
        this.loadJobs();
    }

    deleteJob(id: string) {
        if (confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
            this.jobService.deleteJob(id).subscribe({
                next: () => {
                    this.loadJobs();
                },
                error: (err) => console.error('Error deleting job:', err)
            });
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'active': return 'role-badge admin'; // Re-using indigo for active
            case 'closed': return 'role-badge'; // Re-using grey for closed
            case 'draft': return 'role-badge';
            default: return 'role-badge';
        }
    }

    logout() {
        this.authService.logout();
    }
}
