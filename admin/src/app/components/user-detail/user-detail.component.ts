import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';

declare var lucide: any;

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.css'],
    standalone: false
})
export class UserDetailComponent implements OnInit, AfterViewInit {
    user: any = null;
    loading: boolean = true;
    error: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadUserDetails(id);
        } else {
            this.router.navigate(['/manage-users']);
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

    loadUserDetails(id: string) {
        this.loading = true;
        this.userService.getUserById(id).subscribe({
            next: (res: any) => {
                this.user = res.data;
                this.loading = false;
                setTimeout(() => this.initIcons(), 0);
            },
            error: (err) => {
                console.error('Error fetching user details:', err);
                this.error = 'Failed to load user details.';
                this.loading = false;
            }
        });
    }

    getApplicationStatus(job: any): string {
        if (!job || !job.applicants || !this.user) return 'pending';
        const application = job.applicants.find((a: any) =>
            (a.user._id === this.user._id) || (a.user === this.user._id)
        );
        return application ? application.status : 'pending';
    }

    getStatusClass(status: string): string {
        const map: any = {
            pending: 'status-pending',
            shortlisted: 'status-shortlisted',
            accepted: 'status-accepted',
            rejected: 'status-rejected',
            reviewed: 'status-reviewed'
        };
        return map[status] || 'status-pending';
    }

    goBack() {
        this.router.navigate(['/manage-users']);
    }
}
